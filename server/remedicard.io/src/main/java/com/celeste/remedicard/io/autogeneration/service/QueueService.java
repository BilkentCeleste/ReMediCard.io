package com.celeste.remedicard.io.autogeneration.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import com.celeste.remedicard.io.autogeneration.dto.DeckCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.QuizCreationTask;
import com.celeste.remedicard.io.autogeneration.entity.MediaProcessingRecord;
import com.celeste.remedicard.io.autogeneration.repository.MediaProcessingRecordRepository;
import com.celeste.remedicard.io.deck.service.DeckService;
import com.celeste.remedicard.io.notification.entity.Notification;
import com.celeste.remedicard.io.notification.service.NotificationService;
import com.celeste.remedicard.io.quiz.service.QuizService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@EnableScheduling
@RequiredArgsConstructor
@Service
public class QueueService {

    private static final String VIDEO_RECORD_QUEUE_NAME = "video-queue";
    private static final String VOICE_RECORD_QUEUE_NAME = "voice-queue";
    private static final String LECTURE_NOTES_IMAGES_QUEUE_NAME = "ln-images-queue";
    private static final String LECTURE_NOTES_PDF_QUEUE_NAME = "ln-pdf-queue";

    private static final String DECK_GENERATION_QUEUE_NAME = "deck-generation-queue";
    private static final String QUIZ_GENERATION_QUEUE_NAME = "quiz-generation-queue";

    private final DeckService deckService;
    private final QuizService quizService;

    private final NotificationService notificationService;

    private final MediaProcessingRecordRepository mediaProcessingRecordRepository;

    @Resource(name = "redisTemplateDataProcessingTask")
    private ListOperations<String, DataProcessingTask> dataProcessingTaskListOperations;

    @Resource(name = "redisTemplateDeckCreationTask")
    private ListOperations<String, DeckCreationTask> deckCreationTaskListOperations;

    @Resource(name = "redisTemplateQuizCreationTask")
    private ListOperations<String, QuizCreationTask> quizCreationTaskListOperations;

    public void enqueueVideoRecord(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(VIDEO_RECORD_QUEUE_NAME, dataProcessingTask);
    }

    public void enqueueVoiceRecord(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(VOICE_RECORD_QUEUE_NAME, dataProcessingTask);
    }

    public void enqueueLectureNotesImages(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(LECTURE_NOTES_IMAGES_QUEUE_NAME, dataProcessingTask);
    }

    public void enqueueLectureNotesPdf(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(LECTURE_NOTES_PDF_QUEUE_NAME, dataProcessingTask);
    }

    public DataProcessingTask dequeueVideoRecord() {
        return dataProcessingTaskListOperations.rightPop(VIDEO_RECORD_QUEUE_NAME, 0, TimeUnit.SECONDS);
    }

    public DataProcessingTask dequeueVoiceRecord() {
        return dataProcessingTaskListOperations.rightPop(VOICE_RECORD_QUEUE_NAME, 0, TimeUnit.SECONDS);
    }

    public DataProcessingTask dequeueVideoRecordNonBlocking() {
        return dataProcessingTaskListOperations.rightPop(VIDEO_RECORD_QUEUE_NAME);
    }

    public DataProcessingTask dequeueVoiceRecordNonBlocking() {
        return dataProcessingTaskListOperations.rightPop(VOICE_RECORD_QUEUE_NAME);
    }

    public Long getQueueSize(DataType dataType) {

        if(dataType.equals(DataType.VIDEO_RECORD)) {
            return dataProcessingTaskListOperations.size(VIDEO_RECORD_QUEUE_NAME);
        }

        if(dataType.equals(DataType.VOICE_RECORD)) {
            return dataProcessingTaskListOperations.size(VOICE_RECORD_QUEUE_NAME);
        }

        //TODO OTHER DATA TYPES
        throw new RuntimeException("Unsupported data type: " + dataType);
    }

    @Scheduled(fixedDelay = 30000)
    public void pollDeckGenerationQueue() {

        DeckCreationTask deckCreationTask;
        while ((deckCreationTask = deckCreationTaskListOperations.rightPop(DECK_GENERATION_QUEUE_NAME)) != null) {

            log.info("Processing auto-generation task for the deck: " + deckCreationTask.getUserId() + ", " + deckCreationTask.getName());

            deckService.createDeck(deckCreationTask);

            MediaProcessingRecord mediaProcessingRecord = mediaProcessingRecordRepository.findById(deckCreationTask.getMediaProcessingRecordId()).orElseThrow(
                    IllegalArgumentException::new
            );

            mediaProcessingRecord.setIsProcessed(true);
            mediaProcessingRecordRepository.save(mediaProcessingRecord);

            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            notificationService.sendNotification("deck_generated", "deck_generated_message", new String[]{deckCreationTask.getName()}, user.getPushNotificationToken());
        }

        //log.info("Deck generation queue is empty");
    }

    @Scheduled(fixedDelay = 30000)
    public void pollQuizGenerationQueue() {

        QuizCreationTask quizCreationTask;
        while ((quizCreationTask = quizCreationTaskListOperations.rightPop(QUIZ_GENERATION_QUEUE_NAME)) != null) {

            log.info("Processing auto-generation task for the quiz: " + quizCreationTask.getUserId() + ", " + quizCreationTask.getName());

            quizService.createQuiz(quizCreationTask);

            MediaProcessingRecord mediaProcessingRecord = mediaProcessingRecordRepository.findById(quizCreationTask.getMediaProcessingRecordId()).orElseThrow(
                    IllegalArgumentException::new
            );

            mediaProcessingRecord.setIsProcessed(true);
            mediaProcessingRecordRepository.save(mediaProcessingRecord);

            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            notificationService.sendNotification("quiz_generated", "quiz_generated_message", new String[]{quizCreationTask.getName()}, user.getPushNotificationToken());
        }

        //log.info("Quiz generation queue is empty");
    }

}

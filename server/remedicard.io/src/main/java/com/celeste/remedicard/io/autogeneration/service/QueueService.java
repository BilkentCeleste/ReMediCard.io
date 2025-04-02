package com.celeste.remedicard.io.autogeneration.service;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.dto.DataProcessingTask;
import com.celeste.remedicard.io.autogeneration.dto.DeckCreationTask;
import com.celeste.remedicard.io.deck.service.DeckService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@EnableScheduling
@RequiredArgsConstructor
@Service
public class QueueService {

    private static final String VIDEO_RECORD_QUEUE_NAME = "video-queue";
    private static final String VOICE_RECORD_QUEUE_NAME = "voice-queue";
    private static final String DECK_GENERATION_QUEUE_NAME = "generation-queue";

    private final DeckService deckService;

    @Resource(name = "redisTemplateDataProcessingTask")
    private ListOperations<String, DataProcessingTask> dataProcessingTaskListOperations;

    @Resource(name = "redisTemplateDeckCreationTask")
    private ListOperations<String, DeckCreationTask> deckCreationTaskListOperations;

    public void enqueueVideoRecord(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(VIDEO_RECORD_QUEUE_NAME, dataProcessingTask);
    }

    public void enqueueVoiceRecord(DataProcessingTask dataProcessingTask) {
        dataProcessingTaskListOperations.leftPush(VOICE_RECORD_QUEUE_NAME, dataProcessingTask);
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

            log.info("Processing auto-generation task for: " + deckCreationTask.getUserId() + ", " + deckCreationTask.getName());

            deckService.createDeck(deckCreationTask);
        }

        log.info("Generation queue is empty");
    }

}

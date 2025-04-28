package com.celeste.remedicard.io.studyGoals.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.notification.service.NotificationService;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsCreateRequestDTO;
import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsResponseDTO;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import com.celeste.remedicard.io.studyGoals.mapper.StudyGoalsResponseMapper;
import com.celeste.remedicard.io.studyGoals.repository.StudyGoalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyGoalsService {

    private final StudyGoalsRepository studyGoalsRepository;
    private final DeckRepository deckRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final QuizRepository quizRepository;

    public void create(StudyGoalsCreateRequestDTO dto) {
        if ((dto.getDeckId() == null && dto.getQuizId() == null) ||
                (dto.getDeckId() != null && dto.getQuizId() != null)) {
            throw new IllegalArgumentException("Either deckId or quizId must be provided, but not both.");
        }
        User user = currentUserService.getCurrentUser();

        StudyGoals goal = new StudyGoals();
        goal.setUser(user);
        goal.setDeckId(dto.getDeckId());
        goal.setQuizId(dto.getQuizId());
        goal.setTargetPerformance(dto.getTargetPerformance());
        goal.setStartDate(LocalDateTime.now());
        goal.setEndDate(LocalDateTime.now().plusDays(dto.getDurationInDays()));
        goal.setRepetitionInterval(dto.getRepetitionIntervalInHours());
        goal.setNextNotificationDate(LocalDateTime.now().plusHours(dto.getRepetitionIntervalInHours()));
        goal.setCompleted(false);

        studyGoalsRepository.save(goal);
    }

    public void delete(Long studyGoalsId) {
        StudyGoals studyGoals = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsRepository.delete(studyGoals);
    }

    public void deleteByDeckId(Long deckId) {
        List<StudyGoals> studyGoals = studyGoalsRepository.findByDeckId(deckId);
        studyGoalsRepository.deleteAll(studyGoals);
    }

    public void deleteByQuizId(Long quizId) {
        List<StudyGoals> studyGoals = studyGoalsRepository.findByQuizId(quizId);
        studyGoalsRepository.deleteAll(studyGoals);
    }

    public void update(StudyGoalsCreateRequestDTO dto, Long studyGoalsId) {
        StudyGoals studyGoalsToUpdate = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsToUpdate.setTargetPerformance(dto.getTargetPerformance());
        studyGoalsToUpdate.setEndDate(studyGoalsToUpdate.getStartDate().plusDays(dto.getDurationInDays()));
        studyGoalsToUpdate.setRepetitionInterval(dto.getRepetitionIntervalInHours());
        studyGoalsToUpdate.setNextNotificationDate(LocalDateTime.now().plusHours(dto.getRepetitionIntervalInHours()));
        studyGoalsRepository.save(studyGoalsToUpdate);
    }

    public StudyGoalsResponseDTO getRandomStudyGoalByCurrentUser() {
        Long currentUserId = currentUserService.getCurrentUserId();
        StudyGoals studyGoal = studyGoalsRepository.getRandomStudyGoalByUserId(currentUserId);
        StudyGoalsResponseDTO dto = StudyGoalsResponseMapper.INSTANCE.toDTO(studyGoal);
        if( studyGoal != null){
            if (studyGoal.getDeckId() != null) {
                Deck deck = deckRepository.findById(studyGoal.getDeckId()).orElseThrow(() -> new RuntimeException("Deck not found"));
                dto.setDeckOrQuizName(deck.getName());
            }
            if(studyGoal.getQuizId() != null) {
                Quiz quiz = quizRepository.findById(studyGoal.getQuizId()).orElseThrow(() -> new RuntimeException("Quiz not found"));
                dto.setDeckOrQuizName(quiz.getName());
            }
        }
        return dto;
    }
    
    public List<StudyGoalsResponseDTO> getStudyGoalsByUserId(Long userId) {
        List<StudyGoals> studyGoals = studyGoalsRepository.findByUserId(userId);
        List<StudyGoalsResponseDTO> dto = StudyGoalsResponseMapper.INSTANCE.toDTO(studyGoals);
        for( int i = 0; i < dto.size(); i++) {
            if (studyGoals.get(i).getDeckId() != null) {
                Deck deck = deckRepository.findById(studyGoals.get(i).getDeckId()).orElseThrow(() -> new RuntimeException("Deck not found"));
                dto.get(i).setDeckOrQuizName(deck.getName());
            }
            if(studyGoals.get(i).getQuizId() != null) {
                Quiz quiz = quizRepository.findById(studyGoals.get(i).getQuizId()).orElseThrow(() -> new RuntimeException("Quiz not found"));
                dto.get(i).setDeckOrQuizName(quiz.getName());
            }
        }
        return dto;
    }

    public void checkIsGoalCompleted(Long userId, Long quizOrDeckId, double performance){
        List<StudyGoals> studyGoals = studyGoalsRepository.findStudyGoalsByUserIdAndDeckOrQuizId(userId, quizOrDeckId);
        for (StudyGoals studyGoal : studyGoals) {
            if (performance >= studyGoal.getTargetPerformance()) {
                studyGoal.setCompleted(true);
                studyGoalsRepository.save(studyGoal);
                currentUserService.setCurrentUser(studyGoal.getUser());
                notificationService.sendNotification(
                        "study_goal_completed",
                        "study_goal_completed_message",
                        new String[]{studyGoal.getDeckId() != null ? deckRepository.findById(studyGoal.getDeckId()).get().getName() : quizRepository.findById(studyGoal.getQuizId()).get().getName()},
                        studyGoal.getUser().getPushNotificationToken()
                );
            }
        }
    }

    @Scheduled(cron = "0 0 * * * *") // 1 hour
    public void sendStudyGoalNotifications() {
        List<StudyGoals> dueGoals = studyGoalsRepository.findAllDueGoals(LocalDateTime.now());
        for (StudyGoals goal : dueGoals) {
            currentUserService.setCurrentUser(goal.getUser());
            notificationService.sendNotification(
                    "study_goal_reminder",
                    "study_goal_reminder_message",
                    new String[]{goal.getDeckId() != null ? deckRepository.findById(goal.getDeckId()).get().getName() : quizRepository.findById(goal.getQuizId()).get().getName()},
                    goal.getUser().getPushNotificationToken()
            );
            goal.setNextNotificationDate(goal.getNextNotificationDate().plusHours(goal.getRepetitionInterval()));
            studyGoalsRepository.save(goal);
        }
    }

}

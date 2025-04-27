package com.celeste.remedicard.io.studyGoals.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.notification.service.NotificationService;
import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsCreateRequestDTO;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoalStatus;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import com.celeste.remedicard.io.studyGoals.repository.StudyGoalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudyGoalsService {

    private final StudyGoalsRepository studyGoalsRepository;
    private final DeckRepository deckRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

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
        goal.setRepetitionInterval(Duration.ofHours(dto.getRepetitionIntervalInHours()));
        goal.setNextNotificationDate(LocalDateTime.now().plusHours(dto.getRepetitionIntervalInHours()));
        goal.setStatus(StudyGoalStatus.ACTIVE);

        studyGoalsRepository.save(goal);
    }

    public void delete(Long studyGoalsId) {
        StudyGoals studyGoals = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsRepository.delete(studyGoals);
    }

    public void update(StudyGoalsCreateRequestDTO dto, Long studyGoalsId) {
        StudyGoals studyGoalsToUpdate = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsToUpdate.setTargetPerformance(dto.getTargetPerformance());
        studyGoalsToUpdate.setEndDate(studyGoalsToUpdate.getStartDate().plusDays(dto.getDurationInDays()));
        studyGoalsToUpdate.setRepetitionInterval(Duration.ofHours(dto.getRepetitionIntervalInHours()));
        studyGoalsToUpdate.setNextNotificationDate(LocalDateTime.now().plusHours(dto.getRepetitionIntervalInHours()));
        studyGoalsRepository.save(studyGoalsToUpdate);
    }
    
    public Set<StudyGoals> getStudyGoalsByUserId(Long userId) {
        return studyGoalsRepository.findByUserId(userId);
    }

    @Scheduled(cron = "0 0 * * * *") // 1 hour
    public void sendStudyGoalNotifications() {
        List<StudyGoals> dueGoals = studyGoalsRepository.findAllDueGoals(LocalDateTime.now());
        for (StudyGoals goal : dueGoals) {
            notificationService.sendNotification(
                    "notification.study-goal.title",
                    "notification.study-goal.message",
                    new String[]{goal.getDeckId() != null ? deckRepository.findById(goal.getDeckId()).get().getName() : "Quiz"},
                    goal.getUser().getPushNotificationToken()
            );
            goal.setNextNotificationDate(goal.getNextNotificationDate().plus(goal.getRepetitionInterval()));
            studyGoalsRepository.save(goal);
        }
    }

}

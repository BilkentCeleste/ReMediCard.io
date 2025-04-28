package com.celeste.remedicard.io.studyGoals.repository;

import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface StudyGoalsRepository extends JpaRepository<StudyGoals, Long> {
    List<StudyGoals> findByUserId(Long userId);

    @Query("SELECT s FROM StudyGoals s WHERE s.user.id = :userId AND (s.deckId = :deckOrQuizId OR s.quizId = :deckOrQuizId) AND s.isCompleted = false")
    List<StudyGoals> findStudyGoalsByUserIdAndDeckOrQuizId(Long userId, Long deckOrQuizId);

    @Query("SELECT s FROM StudyGoals s WHERE s.nextNotificationDate <= :dueDate")
    List<StudyGoals> findAllDueGoals(LocalDateTime dueDate);

    @Query("SELECT s FROM StudyGoals s WHERE s.user.id = :userId ORDER BY RANDOM() LIMIT 1")
    StudyGoals getRandomStudyGoalByUserId(Long userId);
}

package com.celeste.remedicard.io.studyGoals.repository;

import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface StudyGoalsRepository extends JpaRepository<StudyGoals, Long> {
    Set<StudyGoals> findByUserId(Long userId);

    Optional<StudyGoals> findByUserIdAndDeckId(Long userId, Long deckId);
}

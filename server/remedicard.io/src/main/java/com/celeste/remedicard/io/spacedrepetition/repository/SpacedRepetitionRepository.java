package com.celeste.remedicard.io.spacedrepetition.repository;

import com.celeste.remedicard.io.spacedrepetition.entity.SpacedRepetition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SpacedRepetitionRepository extends JpaRepository<SpacedRepetition, Long> {
    SpacedRepetition findByUserIdAndFlashcardId(Long userId, Long flashcardId);

    @Query("SELECT sr FROM SpacedRepetition sr " +
            "WHERE sr.user.id = :userId " +
            "AND sr.flashcard.deck.id = :deckId")
    List<SpacedRepetition> findByUserIdAndDeckId(Long userId, Long deckId);
}

package com.celeste.remedicard.io.deckStats.repository;

import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface DeckStatsRepository extends JpaRepository<DeckStats, Long> {

    Optional<Set<DeckStats>> findByDeckIdAndUserId(Long deckId, Long userId);

    @Query("SELECT ds FROM DeckStats ds WHERE ds.deck.id = :deckId AND ds.user.id = :userId ORDER BY ds.successRate DESC LIMIT 1")
    Optional<DeckStats> findBestByDeckIdAndUserId(Long deckId, Long userId);

    @Query("SELECT ds FROM DeckStats ds WHERE ds.deck.id = :deckId AND ds.user.id = :userId ORDER BY ds.accessDate DESC LIMIT 1")
    Optional<DeckStats> findLastByDeckIdAndUserId(Long deckId, Long userId);
}

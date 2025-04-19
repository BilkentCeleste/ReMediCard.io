package com.celeste.remedicard.io.deckStats.repository;

import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface DeckStatsRepository extends JpaRepository<DeckStats, Long> {

    Optional<Set<DeckStats>> findByDeckIdAndUserId(Long deckId, Long userId);
}

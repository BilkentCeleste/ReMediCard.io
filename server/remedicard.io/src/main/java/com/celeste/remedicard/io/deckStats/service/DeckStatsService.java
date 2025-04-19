package com.celeste.remedicard.io.deckStats.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.repository.DeckStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DeckStatsService {
    private final DeckStatsRepository deckStatsRepository;
    private final DeckRepository deckRepository;
    private final CurrentUserService currentUserService;

    public void create(DeckStats deckStats, Long deckId) {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
        User user = currentUserService.getCurrentUser();

        deckStats.setDeck(deck);
        deckStats.setUser(user);
        deckStats.setAccessDate(LocalDateTime.now());
        System.out.println(deckStats);
        deckStatsRepository.save(deckStats);
    }

    public void delete(Long deckStatsId) {
        DeckStats deckStats = deckStatsRepository.findById(deckStatsId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"));
        deckStatsRepository.delete(deckStats);
    }

    public Set<DeckStats> getDeckStatsByDeckIdAndUserId(Long deckId, Long userId) {

        return deckStatsRepository.findByDeckIdAndUserId(deckId, userId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"));
    }

    public DeckStats getBestDeckStatsByDeckIdAndUserId(Long deckId, Long userId) {
        return deckStatsRepository.findByDeckIdAndUserId(deckId, userId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"))
                .stream()
                .max(Comparator.comparingDouble(DeckStats::getSuccessRate))
                .orElseThrow(() -> new RuntimeException("No deck stats found"));
    }

    public DeckStats getLastDeckStatsByDeckIdAndUserId(Long deckId, Long userId) {
        return deckStatsRepository.findByDeckIdAndUserId(deckId, userId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"))
                .stream()
                .max(Comparator.comparing(DeckStats::getAccessDate))
                .orElseThrow(() -> new RuntimeException("No deck stats found"));
    }
}

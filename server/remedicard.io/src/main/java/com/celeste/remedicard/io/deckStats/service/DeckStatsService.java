package com.celeste.remedicard.io.deckStats.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseWithDeckNameDTO;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.repository.DeckStatsRepository;
import com.celeste.remedicard.io.studyGoals.service.StudyGoalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DeckStatsService {
    private final DeckStatsRepository deckStatsRepository;
    private final DeckRepository deckRepository;
    private final CurrentUserService currentUserService;
    private final StudyGoalsService studyGoalsService;

    public void create(DeckStats deckStats, Long deckId) {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
        User user = currentUserService.getCurrentUser();

        deckStats.setDeck(deck);
        deckStats.setUser(user);
        deckStats.setAccessDate(LocalDateTime.now());
        deckStatsRepository.save(deckStats);

        studyGoalsService.checkIsGoalCompleted(user.getId(), deck.getId(), deckStats.getSuccessRate());
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
        return deckStatsRepository.findBestByDeckIdAndUserId(deckId, userId).orElse(null);
    }

    public DeckStats getLastDeckStatsByDeckIdAndUserId(Long deckId, Long userId) {
        return deckStatsRepository.findLastByDeckIdAndUserId(deckId, userId).orElse(null);
    }

    public DeckStatsResponseWithDeckNameDTO getRandomDeckStatsByCurrentUser() {
        Long userId = currentUserService.getCurrentUserId();
        DeckStats deckStats = deckStatsRepository.getRandomByUserId(userId).orElse(null);
        if(deckStats == null ){
            return null;
        }
        DeckStatsResponseWithDeckNameDTO dto = new DeckStatsResponseWithDeckNameDTO();
        dto.setDeckName(deckStats.getDeck().getName());
        dto.setSuccessRate(deckStats.getSuccessRate());
        dto.setAccessDate(deckStats.getAccessDate());
        return dto;
    }
}

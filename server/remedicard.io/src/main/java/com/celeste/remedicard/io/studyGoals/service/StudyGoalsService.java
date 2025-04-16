package com.celeste.remedicard.io.studyGoals.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import com.celeste.remedicard.io.studyGoals.repository.StudyGoalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudyGoalsService {

    private final StudyGoalsRepository studyGoalsRepository;
    private final DeckRepository deckRepository;
    private final CurrentUserService currentUserService;

    public void create(StudyGoals studyGoals, Long deckId) {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
        User user = currentUserService.getCurrentUser();

        studyGoals.setDeck(deck);
        studyGoals.setUser(user);
        studyGoalsRepository.save(studyGoals);
    }

    public void delete(Long studyGoalsId) {
        StudyGoals studyGoals = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsRepository.delete(studyGoals);
    }

    public void update(StudyGoals studyGoals, Long studyGoalsId) {
        StudyGoals studyGoalsToUpdate = studyGoalsRepository.findById(studyGoalsId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
        studyGoalsToUpdate.setTargetPerformance(studyGoals.getTargetPerformance());
        studyGoalsRepository.save(studyGoalsToUpdate);
    }

    public StudyGoals getStudyGoalsByUserIdAndDeckId(Long userId, Long deckId) {
        return studyGoalsRepository.findByUserIdAndDeckId(userId, deckId)
                .orElseThrow(() -> new RuntimeException("Study goals not found"));
    }
    
    public Set<StudyGoals> getStudyGoalsByUserId(Long userId) {
        return studyGoalsRepository.findByUserId(userId);
    }
}

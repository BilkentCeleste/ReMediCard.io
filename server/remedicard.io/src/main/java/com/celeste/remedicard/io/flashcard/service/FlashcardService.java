package com.celeste.remedicard.io.flashcard.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.repository.FlashcardRepository;
import com.celeste.remedicard.io.spacedRepetition.service.SpacedRepetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;
    private final SpacedRepetitionService spacedRepetitionService;

    public void create(Flashcard flashcard, Long deckId) {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
        flashcard.setDeck(deck);
        flashcardRepository.save(flashcard);
        spacedRepetitionService.create(deck.getUser(), flashcard);
    }

    public List<FlashcardResponseDTO> getFlashcardsInBatch(Long deckId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return spacedRepetitionService.getFlashcardsInBatch(user.getId(), deckId, 20);
    }

    public void updateFlashcardReviews(List<FlashcardReviewDTO> reviews){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        spacedRepetitionService.updateFlashcardReviews(user.getId(), reviews);
    }

    public void delete(Long flashcardId) {
        flashcardRepository.deleteById(flashcardId);
    }

    public void update(Flashcard flashcard, Long flashcardId) {
        Flashcard flashcardToUpdate = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        flashcardToUpdate.setTopic(flashcard.getTopic());
        flashcardToUpdate.setType(flashcard.getType());
        flashcardToUpdate.setFrequency(flashcard.getFrequency());
        flashcardToUpdate.setFrontSide(flashcard.getFrontSide());
        flashcardToUpdate.setBackSide(flashcard.getBackSide());
        flashcardRepository.save(flashcardToUpdate);
    }
}

package com.celeste.remedicard.io.flashcard.service;

import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.flashcard.repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    private final DeckRepository deckRepository;

    public void create(Flashcard flashcard, Long deckId, String frontText, String backText, Set<URL> frontUrlSet, Set<URL> backUrlSet) {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));

        Side front = new Side();
        front.setText(frontText);
        front.setUrlSet(frontUrlSet);

        Side back = new Side();
        back.setText(backText);
        back.setUrlSet(backUrlSet);

        flashcard.setFrontSide(front);
        flashcard.setBackSide(back);
        flashcard.setDeck(deck);

        flashcardRepository.save(flashcard);
    }
}

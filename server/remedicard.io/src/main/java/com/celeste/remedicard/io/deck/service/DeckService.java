package com.celeste.remedicard.io.deck.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeckService {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public void create(Deck deck, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        deck.setUser(user);
        deckRepository.save(deck);
    }

//    public List<Deck> listByUser(Long userId) {
//        return deckRepository.findAllByUserId(userId);
//    }

    public Deck getDeckByDeckId(Long deckId) {
        return deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
    }

    public Set<Deck> getDeckByUserId(Long userId) {
        return deckRepository.findAllByUserId(userId);
    }
}

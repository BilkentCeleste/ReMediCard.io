package com.celeste.remedicard.io.deck.service;

import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeckService {

    private final DeckRepository deckRepository;

    public void create(Deck deck) {
        deckRepository.save(deck);
    }

//    public List<Deck> listByUser(Long userId) {
//        return deckRepository.findAllByUserId(userId);
//    }
}

package com.celeste.remedicard.io.deck.repository;

import com.celeste.remedicard.io.deck.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    Set<Deck> findAllByUserId(Long userId);
}

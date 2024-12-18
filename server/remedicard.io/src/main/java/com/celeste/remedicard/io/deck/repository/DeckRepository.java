package com.celeste.remedicard.io.deck.repository;

import com.celeste.remedicard.io.deck.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeckRepository extends JpaRepository<Deck, Long> {

}

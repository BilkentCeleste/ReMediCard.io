package com.celeste.remedicard.io.deck.repository;

import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    Set<Deck> findAllByUserId(Long userId);
    Set<Deck> findAllByUserIdOrderByIdAsc(Long userId);
    Optional<Deck> findByShareToken(String shareToken);
}

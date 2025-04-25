package com.celeste.remedicard.io.deck.repository;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.deck.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    Set<Deck> findAllByUserId(Long userId);
    Set<Deck> findAllByUserIdOrderByIdAsc(Long userId);
    Optional<Deck> findByShareToken(String shareToken);


    List<Deck> findAllByIsPubliclyVisibleAndUserNot(Boolean isPubliclyVisible, User user);
    List<Deck> findAllByIsPubliclyVisibleAndUserNotOrderByLikeCountDesc(Boolean isPubliclyVisible, User user);
    List<Deck> findAllByIsPubliclyVisibleAndUserNotOrderByCreatedDateDesc(Boolean isPubliclyVisible, User user);
}

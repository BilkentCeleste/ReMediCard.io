package com.celeste.remedicard.io.deck.repository;

import com.celeste.remedicard.io.deck.entity.DeckShareLink;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DeckShareLinkRepository extends JpaRepository<DeckShareLink, Long> {
    DeckShareLink findByShareToken(String shareToken);
}

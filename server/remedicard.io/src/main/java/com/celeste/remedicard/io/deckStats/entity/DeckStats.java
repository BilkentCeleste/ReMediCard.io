package com.celeste.remedicard.io.deckStats.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AbstractEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "deck_stats")
public class DeckStats extends AbstractEntity {

    @Column
    private LocalDateTime accessDate;

    @Column
    private double successRate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;
}

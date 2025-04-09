package com.celeste.remedicard.io.deck.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "DECK_SHARE_LINK")
public class DeckShareLink extends AuditableEntity {

    @Column(unique = true, nullable = false)
    private String shareToken;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Deck deck;

    @Column
    private LocalDateTime expiryDate;

    @Column
    private boolean active;
} 
package com.celeste.remedicard.io.spacedRepetition.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "spaced_repetition")
public class SpacedRepetition extends AuditableEntity{

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "flashcard_id", nullable = false)
    private Flashcard flashcard;

    @Column(columnDefinition = "TEXT") // Json representation of EbisuModel
    private String model;

    private double recallProbability;  // Cached recall probability

    private LocalDateTime lastReviewed;

}

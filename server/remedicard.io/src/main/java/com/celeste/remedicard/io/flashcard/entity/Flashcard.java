package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "FLASHCARD")
public class Flashcard extends AuditableEntity {

    @Column
    private String topic;

    @Column
    private String type;

    @Column
    private double frequency;

    @OneToOne
    private Side frontSide;

    @OneToOne
    private Side backSide;

    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;
}

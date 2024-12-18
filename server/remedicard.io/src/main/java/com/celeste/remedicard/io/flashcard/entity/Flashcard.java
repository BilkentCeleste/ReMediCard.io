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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "front_side_id", referencedColumnName = "id", nullable = false)
    private Side frontSide;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "back_side_id", referencedColumnName = "id", nullable = false)
    private Side backSide;

    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;
}

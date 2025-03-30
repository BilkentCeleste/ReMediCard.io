package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.spacedRepetition.entity.SpacedRepetition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@Table(name = "FLASHCARD")
@NoArgsConstructor
@AllArgsConstructor
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
    @JsonIgnore
    private Deck deck;

    @OneToMany(mappedBy = "flashcard", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SpacedRepetition> spacedRepetitionRecords;
}

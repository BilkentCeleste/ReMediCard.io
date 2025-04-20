package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.spacedrepetition.entity.SpacedRepetition;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.BeanUtils;

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

    public Flashcard(Flashcard flashcard) {
        BeanUtils.copyProperties(flashcard, this, "id", "deck", "spacedRepetitionRecords", "frontSide", "backSide");
        this.frontSide = new Side(flashcard.getFrontSide());
        this.backSide = new Side(flashcard.getBackSide());
    }
}

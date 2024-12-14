package com.celeste.remedicard.io.deck.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.figure.entity.Figure;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "DECK")
public class Deck extends AuditableEntity {

    @Column
    private String topic;

    @Column
    private String name;

    @Column
    private String difficulty;

    @Column
    private int flashcardCount;

    @Column
    private int popularity;

    @ManyToMany
    @JoinTable(
            name = "deck_figure",
            joinColumns = @JoinColumn(name = "deck_id"),
            inverseJoinColumns = @JoinColumn(name = "figure_id")
    )
    private Set<Figure> figureSet;

    @ManyToMany
    @JoinTable(
            name = "deck_flashcard",
            joinColumns = @JoinColumn(name = "deck_id"),
            inverseJoinColumns = @JoinColumn(name = "flashcard_id")
    )
    private Set<Flashcard> flashcardSet;
}

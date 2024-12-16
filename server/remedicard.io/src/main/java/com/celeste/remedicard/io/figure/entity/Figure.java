package com.celeste.remedicard.io.figure.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "FIGURE")
public class Figure extends AuditableEntity {

    @Column
    private String title;

    @OneToMany(mappedBy = "figure", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Label> labelSet;

    @ManyToMany(mappedBy = "figureSet")
    private Set<Deck> decks;

    public void addLabel(Label label) {
        labelSet.add(label);
        label.setFigure(this);
    }

    public void removeLabel(Label label) {
        labelSet.remove(label);
        label.setFigure(null);
    }
}

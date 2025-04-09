package com.celeste.remedicard.io.deck.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.figure.entity.Figure;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private Set<Figure> figureSet = new HashSet<>();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Flashcard> flashcardSet = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DeckShareLink> shareLinks = new HashSet<>();

    public DeckShareLink createShareLink() {
        DeckShareLink shareLink = DeckShareLink.builder()
                .shareToken(java.util.UUID.randomUUID().toString())
                .expiryDate(java.time.LocalDateTime.now().plusDays(7))
                .deck(this)
                .active(true)
                .build();

        shareLinks.add(shareLink);
        return shareLink;
    }
}

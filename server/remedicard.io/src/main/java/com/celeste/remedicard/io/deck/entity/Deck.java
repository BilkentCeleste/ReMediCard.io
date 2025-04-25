package com.celeste.remedicard.io.deck.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.figure.entity.Figure;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
    private Integer flashcardCount;

    @Column
    private Integer popularity;

    @Column
    private String shareToken;

    @Column
    private Boolean isPubliclyVisible = false;

    @Column
    private Long likeCount = 0L;

    @Column
    private Long disLikeCount = 0L;

    @ElementCollection
    private Set<Long> likerIds = new HashSet<>();

    @ElementCollection
    private Set<Long> dislikerIds = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "deck_figure",
            joinColumns = @JoinColumn(name = "deck_id"),
            inverseJoinColumns = @JoinColumn(name = "figure_id")
    )
    private Set<Figure> figureSet = new HashSet<>();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Flashcard> flashcardSet = new ArrayList<>();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DeckStats> deckStatsSet = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Deck(Deck deck) {
        BeanUtils.copyProperties(deck, this, "id", "user", "flashcardSet", "figureSet", "shareToken", "deckStatsSet");
        List<Flashcard> originalFlashcards = deck.getFlashcardSet();
        for (Flashcard flashcard : originalFlashcards) {
            this.addFlashcard(new Flashcard(flashcard));
        }
    }

    public void addFlashcard(Flashcard flashcard) {
        this.flashcardSet.add(flashcard);
        flashcard.setDeck(this);
    }

    public void removeFlashcard(Flashcard flashcard) {
        this.flashcardSet.remove(flashcard);
        flashcard.setDeck(null);
    }

    public void addUser(User user) {
        this.user = user;
        user.getDecks().add(this);
    }

    public void removeUser() {
        this.user.getDecks().remove(this);
        this.user = null;
    }
}

package com.celeste.remedicard.io.studyGoals.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "study_goals")
public class StudyGoals extends AuditableEntity {

    @Column
    private int targetPerformance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

}

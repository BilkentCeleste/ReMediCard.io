package com.celeste.remedicard.io.studyGoals.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "study_goals")
public class StudyGoals extends AuditableEntity {

    private Long deckId;    // nullable
    private Long quizId;    // nullable

    private Double targetPerformance;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Duration repetitionInterval;

    private LocalDateTime nextNotificationDate;

    @Enumerated(EnumType.STRING)
    private StudyGoalStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

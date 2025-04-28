package com.celeste.remedicard.io.studyGoals.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AbstractEntity;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import javax.annotation.Nullable;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "study_goals")
public class StudyGoals extends AbstractEntity {

    @Nullable
    private Long deckId;
    @Nullable
    private Long quizId;

    private Double targetPerformance;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private int repetitionInterval; // in hours

    private LocalDateTime nextNotificationDate;

    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

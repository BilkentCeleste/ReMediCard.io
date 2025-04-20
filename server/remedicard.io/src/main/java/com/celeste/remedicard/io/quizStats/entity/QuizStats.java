package com.celeste.remedicard.io.quizStats.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AbstractEntity;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quiz_stats")
public class QuizStats extends AbstractEntity {

    @Column
    private LocalDateTime accessDate;

    @Column
    private double successRate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
}

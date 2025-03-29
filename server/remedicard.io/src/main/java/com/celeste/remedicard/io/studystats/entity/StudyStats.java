package com.celeste.remedicard.io.studystats.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "STUDY_STATS")
public class StudyStats extends AuditableEntity {

    @Column
    private Double averageFLashCardsReviewed;

    @Column
    private Double averageTimeSpent;

    @Column
    private Double averageSuccessRate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

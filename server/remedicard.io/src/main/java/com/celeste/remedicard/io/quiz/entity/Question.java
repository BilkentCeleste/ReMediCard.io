package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name= "QUESTION")
public class Question extends AuditableEntity {

    @Column
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String answer;

    @ElementCollection
    @CollectionTable(name = "OPTIONS", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option", columnDefinition = "TEXT")
    private Set<String> options = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = true)
    private Quiz quiz;
}

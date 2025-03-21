package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name= "QUESTION")
public class Question extends AuditableEntity {

    @Column
    private String difficulty;

    @Column
    private String description;

    @Column
    private String answer;

    @ElementCollection
    @CollectionTable(name = "OPTIONS", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option")
    private Set<String> options = Set.of();

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = true)
    private Quiz quiz;
}

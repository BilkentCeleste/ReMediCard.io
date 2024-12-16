package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name= "QUIZ")
public class Quiz extends AuditableEntity {

    @Column
    private String difficulty;

    @Column
    private Integer popularity;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Question> questions;

    @ManyToMany(mappedBy = "quizzes")
    private Set<User> users;
}

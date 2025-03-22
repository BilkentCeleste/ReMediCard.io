package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name= "QUIZ")
public class Quiz extends AuditableEntity {

    @Column
    private String name;

    @Column
    private String difficulty;

    @Column
    private Integer popularity;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Question> questions = new HashSet<>();

    @ManyToMany(mappedBy = "quizzes")
    private Set<User> users = new HashSet<>();

    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }

    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setQuiz(null);
    }

    public void addUser(User user) {
        users.add(user);
        user.getQuizzes().add(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getQuizzes().remove(this);
    }

    public void removeAllUsers() {
        for (User user : users) {
            user.getQuizzes().remove(this);
        }
        users.clear();
    }
}

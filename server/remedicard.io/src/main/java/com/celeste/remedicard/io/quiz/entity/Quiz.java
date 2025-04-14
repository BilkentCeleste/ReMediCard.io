package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import org.springframework.beans.BeanUtils;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    public Quiz(Quiz quiz) {
        BeanUtils.copyProperties(quiz, this, "id", "user", "questions");

        Set<Question> originalQuestions = quiz.getQuestions();
        for (Question question : originalQuestions) {
            this.addQuestion(new Question(question));
        }
    }

    public void addQuestion(Question question) {
        this.questions.add(question);
        question.setQuiz(this);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
        question.setQuiz(null);
    }

    public void addUser(User user) {
        this.user = user;
        user.getQuizzes().add(this);
    }

    public void removeUser() {
        this.user.getQuizzes().remove(this);
        this.user = null;
    }
}

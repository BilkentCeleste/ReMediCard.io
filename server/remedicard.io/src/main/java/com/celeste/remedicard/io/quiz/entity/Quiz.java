package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import jakarta.persistence.*;
import org.springframework.beans.BeanUtils;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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

    @Column
    private String shareToken;

    @Column
    private Integer questionCount = 0;

    @Column
    private Boolean isPubliclyVisible;

    @Column
    private Long likeCount;

    @Column
    private Long dislikeCount;

    @ElementCollection
    private Set<Long> likerIds;

    @ElementCollection
    private Set<Long> dislikerIds;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<QuizStats> quizStats = new HashSet<>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        if(isPubliclyVisible == null){
            isPubliclyVisible = false;
        }

        if (likeCount == null) {
            likeCount = 0L;
        }
        if (dislikeCount == null) {
            dislikeCount = 0L;
        }
    }

    public Quiz(Quiz quiz) {
        BeanUtils.copyProperties(quiz, this, "id", "user", "questions", "questionCount", "shareToken", "quizStats");
        List<Question> originalQuestions = quiz.getQuestions();
        for (Question question : originalQuestions) {
            this.addQuestion(new Question(question));
        }

        this.isPubliclyVisible = false;
        this.likerIds = new HashSet<>();
        this.dislikerIds = new HashSet<>();
        this.likeCount = 0L;
        this.dislikeCount = 0L;
    }

    public void addQuestion(Question question) {
        this.questions.add(question);
        question.setQuiz(this);
        this.questionCount++;
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
        question.setQuiz(null);
        this.questionCount--;
    }

    public void incrementQuestionCount() {
        this.questionCount++;
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

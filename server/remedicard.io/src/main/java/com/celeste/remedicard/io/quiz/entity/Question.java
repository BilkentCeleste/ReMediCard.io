package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
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
    private Set<String> options = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    public Question(Question question) {
        BeanUtils.copyProperties(question, this, "id", "quiz", "options");
        this.options = new HashSet<>(question.getOptions());
    }
}

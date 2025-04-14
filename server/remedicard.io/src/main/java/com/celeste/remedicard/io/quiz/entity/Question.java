package com.celeste.remedicard.io.quiz.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
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
//    @OrderColumn(name = "option_order")
    @Column(name = "option", columnDefinition = "TEXT")
    private List<String> options = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    public Question(Question question) {
        BeanUtils.copyProperties(question, this, "id", "quiz", "options");
        this.options = new ArrayList<>(question.getOptions());
    }
}

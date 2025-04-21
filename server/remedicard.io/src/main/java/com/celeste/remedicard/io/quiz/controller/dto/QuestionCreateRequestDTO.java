package com.celeste.remedicard.io.quiz.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuestionCreateRequestDTO {

    private String difficulty;
    private String description;
    private Integer correctAnswerIndex;
    private List<String> options;
    private Long quizId;
}

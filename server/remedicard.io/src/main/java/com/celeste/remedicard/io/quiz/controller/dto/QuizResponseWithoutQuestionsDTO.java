package com.celeste.remedicard.io.quiz.controller.dto;

import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsResponseDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuizResponseWithoutQuestionsDTO {

    private Long id;
    private String name;
    private String difficulty;
    private Integer popularity;
    private Integer questionCount;
    private QuizStatsResponseDTO bestQuizStat;
    private QuizStatsResponseDTO lastQuizStat;
}

package com.celeste.remedicard.io.quiz.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuizResponseDTO {

        private Long id;
        private String name;
        private String difficulty;
        private Integer popularity;
        private Integer questionCount;
        Set<QuestionResponseDTO> questions;
}

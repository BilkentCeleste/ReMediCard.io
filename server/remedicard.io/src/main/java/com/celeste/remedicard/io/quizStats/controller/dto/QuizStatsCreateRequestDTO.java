package com.celeste.remedicard.io.quizStats.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizStatsCreateRequestDTO {
    private double successRate;
    private Long quizId;
}

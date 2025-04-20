package com.celeste.remedicard.io.quizStats.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizStatsResponseDTO {
    private LocalDateTime accessDate;
    private double successRate;
}

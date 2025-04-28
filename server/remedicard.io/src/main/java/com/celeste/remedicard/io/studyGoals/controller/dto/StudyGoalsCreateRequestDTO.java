package com.celeste.remedicard.io.studyGoals.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyGoalsCreateRequestDTO {
    Long deckId;
    Long quizId;
    Double targetPerformance;
    Integer durationInDays;
    Integer repetitionIntervalInHours;
}

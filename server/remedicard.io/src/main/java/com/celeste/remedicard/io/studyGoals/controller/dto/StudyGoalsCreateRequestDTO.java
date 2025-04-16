package com.celeste.remedicard.io.studyGoals.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyGoalsCreateRequestDTO {

    int targetPerformance;
    Long deckId;
}

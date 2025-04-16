package com.celeste.remedicard.io.studyGoals.controller.dto;

import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyGoalsResponseDTO {
    private Long id;
    private int targetPerformance;
    private DeckResponseWithoutFlashcardsDTO deck;
}

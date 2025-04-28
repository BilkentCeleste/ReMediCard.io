package com.celeste.remedicard.io.studyGoals.controller.dto;

import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudyGoalsResponseDTO {
    private Long id;
    private int targetPerformance;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int repetitionInterval;
    private String deckOrQuizName;
    private Long quizId;
    private Long deckId;
    private boolean isCompleted;
}

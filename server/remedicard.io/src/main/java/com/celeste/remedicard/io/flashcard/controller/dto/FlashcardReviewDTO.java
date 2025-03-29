package com.celeste.remedicard.io.flashcard.controller.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FlashcardReviewDTO {
    private Long id;
    private boolean isCorrect;
    private LocalDateTime lastReviewed;
}

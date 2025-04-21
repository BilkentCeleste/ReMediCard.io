package com.celeste.remedicard.io.flashcard.controller.dto;

import com.celeste.remedicard.io.flashcard.entity.enums.FlashcardReviewResult;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FlashcardReviewDTO {
    private Long id;
    private FlashcardReviewResult result;
    private LocalDateTime lastReviewed;
}
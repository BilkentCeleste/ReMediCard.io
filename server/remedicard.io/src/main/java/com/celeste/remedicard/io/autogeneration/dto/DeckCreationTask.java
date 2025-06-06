package com.celeste.remedicard.io.autogeneration.dto;

import lombok.Data;

import java.util.Set;

@Data
public class DeckCreationTask {
    private Long userId;
    private Long mediaProcessingRecordId;
    private String name;
    private Set<FlashcardCreationTask> flashcards;
}

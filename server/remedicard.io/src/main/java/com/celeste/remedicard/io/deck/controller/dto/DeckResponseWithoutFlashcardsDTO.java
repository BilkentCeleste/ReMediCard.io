package com.celeste.remedicard.io.deck.controller.dto;

import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseDTO;
import com.celeste.remedicard.io.figure.controller.dto.FigureResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
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
public class DeckResponseWithoutFlashcardsDTO {

    private Long id;
    private String topic;
    private String name;
    private String difficulty;
    private int flashcardCount;
    private int popularity;
    Set<FigureResponseDTO> figureSet;
    private DeckStatsResponseDTO bestDeckStat;
    private DeckStatsResponseDTO lastDeckStat;
    private Boolean isPubliclyVisible;
}

package com.celeste.remedicard.io.spacedRepetition.controller.dto;

import com.celeste.remedicard.io.flashcard.controller.dto.SideResponseDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlashcardForStudyDTO {

    private Long id;
    private String topic;
    private String type;
    private double frequency;
    private Long deckId;
    SideResponseDTO frontSide;
    SideResponseDTO backSide;

    private double recallProbability;
}

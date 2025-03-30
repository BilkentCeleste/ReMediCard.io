package com.celeste.remedicard.io.flashcard.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FlashcardResponseDTO {

    private Long id;
    private String topic;
    private String type;
    private double frequency;
    private Long deckId;
    SideResponseDTO frontSide;
    SideResponseDTO backSide;
    private double recallProbability;
}

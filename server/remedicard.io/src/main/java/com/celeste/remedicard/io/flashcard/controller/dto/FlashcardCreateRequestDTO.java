package com.celeste.remedicard.io.flashcard.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FlashcardCreateRequestDTO {

    private String topic;
    private String type;
    private double frequency;
    private Long deckId;
    SideCreateRequestDTO frontSide;
    SideCreateRequestDTO backSide;
}

package com.celeste.remedicard.io.deck.controller.dto;

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
public class DeckListByUserDTO {

    private String topic;
    private String name;
    private String difficulty;
    private int flashcardCount;
    private int popularity;
}

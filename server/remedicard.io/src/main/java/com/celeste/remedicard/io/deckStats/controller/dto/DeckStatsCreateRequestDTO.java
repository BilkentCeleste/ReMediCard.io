package com.celeste.remedicard.io.deckStats.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeckStatsCreateRequestDTO {

    private double successRate;
    private Long deckId;
}

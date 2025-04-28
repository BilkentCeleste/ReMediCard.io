package com.celeste.remedicard.io.deckStats.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeckStatsResponseWithDeckNameDTO {
    private LocalDateTime accessDate;
    private double successRate;
    private String deckName;
}

package com.celeste.remedicard.io.search.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeckResultDTO {
    private Long id;
    private String name;
}

package com.celeste.remedicard.io.search.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class GeneralSearchResponseDTO {

    List<DeckResultDTO> decks;
    List<QuizResultDTO> quizzes;
}

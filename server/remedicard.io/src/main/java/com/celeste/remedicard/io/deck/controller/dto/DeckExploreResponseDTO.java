package com.celeste.remedicard.io.deck.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeckExploreResponseDTO {

    private Long id;
    private String name;
    private String difficulty;
    private int flashcardCount;
    private Long likeCount;
    private Long dislikeCount;
    private Boolean isDisliked;
    private Boolean isLiked;
    private Date createdDate;
}

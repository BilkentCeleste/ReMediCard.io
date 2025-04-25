package com.celeste.remedicard.io.quiz.controller.dto;

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
public class QuizExploreResponseDTO {

    private Long id;
    private String name;
    private String difficulty;
    private Long likeCount;
    private Long dislikeCount;
    private Boolean isLiked;
    private Boolean isDisliked;
    private Integer questionCount;
}
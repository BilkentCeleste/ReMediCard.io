package com.celeste.remedicard.io.autogeneration.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionCreationTask {

    private String difficulty;
    private String description;
    private Integer correctAnswerIndex;
    private List<String> options;
}

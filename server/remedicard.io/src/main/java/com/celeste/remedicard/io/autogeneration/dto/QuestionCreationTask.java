package com.celeste.remedicard.io.autogeneration.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionCreationTask {

    private String difficulty;
    private String description;
    private String answer;
    private List<String> options;
    private String hint;
    private String explanation;
}

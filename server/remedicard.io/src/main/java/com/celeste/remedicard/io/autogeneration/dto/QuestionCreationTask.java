package com.celeste.remedicard.io.autogeneration.dto;

import lombok.Data;

import java.util.Set;

@Data
public class QuestionCreationTask {

    private String difficulty;
    private String description;
    private String answer;
    private Set<String> options;
}

package com.celeste.remedicard.io.autogeneration.dto;

import lombok.Data;

import java.util.Set;

@Data
public class QuizCreationTask {
    private Long userId;
    private Long mediaProcessingRecordId;
    private String name;
    private Integer difficulty;
    private Integer popularity;
    private Set<QuestionCreationTask> questions;
}

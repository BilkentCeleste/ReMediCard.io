package com.celeste.remedicard.io.search.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Builder
@Data
@Document(indexName = "quizzes")
public class SearchableQuiz {

    @Id
    private Long id;

    private Long userId;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Nested)
    private List<SearchableQuestion> questions;
}

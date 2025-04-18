package com.celeste.remedicard.io.search.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@Data
@Document(indexName = "flashcards")
public class SearchableFlashcard {

    @Id
    private Long id;

    @Field(type = FieldType.Text)
    private String front;

    @Field(type = FieldType.Text)
    private String back;
}

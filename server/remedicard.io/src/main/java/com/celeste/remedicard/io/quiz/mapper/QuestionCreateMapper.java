package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuestionCreateRequestDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface QuestionCreateMapper {

    QuestionCreateMapper INSTANCE = Mappers.getMapper(QuestionCreateMapper.class);

    QuestionCreateRequestDTO toDTO(Question question);

    @Mapping(source = "quizId", target = "quiz.id")
    Question toEntity(QuestionCreateRequestDTO dto);
}
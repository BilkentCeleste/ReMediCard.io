package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuestionCreateRequestDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface QuestionCreateMapper {

    QuestionCreateMapper INSTANCE = Mappers.getMapper(QuestionCreateMapper.class);

    QuestionCreateRequestDTO toDTO(Question question);

    Question toEntity(QuestionCreateRequestDTO dto);
}
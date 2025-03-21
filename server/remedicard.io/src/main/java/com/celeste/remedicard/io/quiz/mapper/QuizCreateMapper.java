package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuizCreateRequestDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface QuizCreateMapper {

    QuizCreateMapper INSTANCE = Mappers.getMapper(QuizCreateMapper.class);

    QuizCreateRequestDTO toDTO(Quiz quiz);

    Quiz toEntity(QuizCreateRequestDTO dto);
}
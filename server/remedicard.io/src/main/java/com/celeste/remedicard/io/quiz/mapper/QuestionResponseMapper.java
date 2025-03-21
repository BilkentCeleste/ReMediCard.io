package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuestionResponseDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface QuestionResponseMapper {

    QuestionResponseMapper INSTANCE = Mappers.getMapper(QuestionResponseMapper.class);

    QuestionResponseDTO toDTO(Question question);

    Set<QuestionResponseDTO> toDTO(Set<Question> questionSet);

    Question toEntity(QuestionResponseDTO dto);
}
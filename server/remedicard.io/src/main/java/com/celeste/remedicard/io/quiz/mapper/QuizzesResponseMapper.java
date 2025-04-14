package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuizzesResponseDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder=true))
public interface QuizzesResponseMapper {

    QuizzesResponseMapper INSTANCE = Mappers.getMapper(QuizzesResponseMapper.class);

    QuizzesResponseDTO toDTO(Quiz quiz);

    Set<QuizzesResponseDTO> toDTO(Set<Quiz> quizSet);

    Quiz toEntity(QuizzesResponseDTO dto);
}
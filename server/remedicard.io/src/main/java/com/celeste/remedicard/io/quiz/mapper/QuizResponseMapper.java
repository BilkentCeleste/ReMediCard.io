package com.celeste.remedicard.io.quiz.mapper;

import com.celeste.remedicard.io.quiz.controller.dto.QuizResponseDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder=true))
public interface QuizResponseMapper {

    QuizResponseMapper INSTANCE = Mappers.getMapper(QuizResponseMapper.class);

    QuizResponseDTO toDTO(Quiz quiz);

    Set<QuizResponseDTO> toDTO(Set<Quiz> quizSet);

    Quiz toEntity(QuizResponseDTO dto);
}
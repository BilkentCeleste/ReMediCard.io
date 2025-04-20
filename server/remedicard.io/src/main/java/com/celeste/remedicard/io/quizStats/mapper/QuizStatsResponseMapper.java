package com.celeste.remedicard.io.quizStats.mapper;

import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsResponseDTO;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface QuizStatsResponseMapper {
    QuizStatsResponseMapper INSTANCE = Mappers.getMapper(QuizStatsResponseMapper.class);

    QuizStatsResponseDTO toDTO(QuizStats quizStats);

    Set<QuizStatsResponseDTO> toDTO(Set<QuizStats> quizStats);

    QuizStats toEntity(QuizStatsResponseDTO dto);
}

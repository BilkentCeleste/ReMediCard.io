package com.celeste.remedicard.io.quizStats.mapper;

import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsCreateRequestDTO;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface QuizStatsCreateRequestMapper {
    QuizStatsCreateRequestMapper INSTANCE = Mappers.getMapper(QuizStatsCreateRequestMapper.class);

    QuizStatsCreateRequestDTO toDTO(QuizStats quizStats);

    QuizStats toEntity(QuizStatsCreateRequestDTO dto);
}

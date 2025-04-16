package com.celeste.remedicard.io.studyGoals.mapper;

import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsCreateRequestDTO;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StudyGoalsCreateRequestMapper {

    StudyGoalsCreateRequestMapper INSTANCE = Mappers.getMapper(StudyGoalsCreateRequestMapper.class);

    StudyGoalsCreateRequestDTO toDTO(StudyGoals studyGoals);

    StudyGoals toEntity(StudyGoalsCreateRequestDTO dto);
}

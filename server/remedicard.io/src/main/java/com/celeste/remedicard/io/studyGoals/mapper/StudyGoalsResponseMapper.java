package com.celeste.remedicard.io.studyGoals.mapper;

import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsResponseDTO;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface StudyGoalsResponseMapper {
    StudyGoalsResponseMapper INSTANCE = Mappers.getMapper(StudyGoalsResponseMapper.class);

    StudyGoalsResponseDTO toDTO(StudyGoals studyGoals);

    Set<StudyGoalsResponseDTO> toDTO(Set<StudyGoals> studyGoals);

    StudyGoals toEntity(StudyGoalsResponseMapper dto);
}

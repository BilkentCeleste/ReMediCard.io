package com.celeste.remedicard.io.spacedRepetition.mapper;

import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.spacedRepetition.controller.dto.FlashcardForStudyDTO;
import com.celeste.remedicard.io.spacedRepetition.entity.SpacedRepetition;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FlashcardForStudyDTOMapper {

    FlashcardForStudyDTOMapper INSTANCE = Mappers.getMapper(FlashcardForStudyDTOMapper.class);

    FlashcardForStudyDTO toDTO(SpacedRepetition spacedRepetition);

    List<FlashcardForStudyDTO> toDTO(List<SpacedRepetition> spacedRepetition);

    SpacedRepetition toEntity(FlashcardForStudyDTO dto);

}

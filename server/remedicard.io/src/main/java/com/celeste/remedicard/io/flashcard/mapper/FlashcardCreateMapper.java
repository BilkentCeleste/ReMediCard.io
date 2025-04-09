package com.celeste.remedicard.io.flashcard.mapper;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.SideCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.spacedrepetition.entity.SpacedRepetition;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FlashcardCreateMapper {

    FlashcardCreateMapper INSTANCE = Mappers.getMapper(FlashcardCreateMapper.class);

    FlashcardCreateRequestDTO toDTO(Flashcard flashcard);

    FlashcardCreateRequestDTO toDTO(SpacedRepetition spacedRepetition);

    @Mapping(target = "frontSide", source = "frontSide", qualifiedByName = "mapSide")
    @Mapping(target = "backSide", source = "backSide", qualifiedByName = "mapSide")
    Flashcard toEntity(FlashcardCreateRequestDTO dto);

    @Named("mapSide")
    default Side mapSide(SideCreateRequestDTO dto) {
        if (dto == null) return null;

        Side side = new Side();
        side.setText(dto.getText());
        side.setUrlSet(dto.getUrlSet());
        return side;
    }
}
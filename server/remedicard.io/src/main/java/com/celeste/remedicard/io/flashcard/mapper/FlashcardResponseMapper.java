package com.celeste.remedicard.io.flashcard.mapper;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.SideCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FlashcardResponseMapper {

    FlashcardResponseMapper INSTANCE = Mappers.getMapper(FlashcardResponseMapper.class);

    FlashcardResponseDTO toDTO(Flashcard flashcard);

    @Named("mapSide")
    default Side mapSide(SideCreateRequestDTO dto) {
        if (dto == null) return null;

        Side side = new Side();
        side.setText(dto.getText());
        side.setUrlSet(dto.getUrlSet());
        return side;
    }
}
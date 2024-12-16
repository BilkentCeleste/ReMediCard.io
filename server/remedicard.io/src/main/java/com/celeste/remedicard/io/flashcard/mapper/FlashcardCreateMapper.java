package com.celeste.remedicard.io.flashcard.mapper;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FlashcardCreateMapper {

    FlashcardCreateMapper INSTANCE = Mappers.getMapper(FlashcardCreateMapper.class);

    FlashcardCreateRequestDTO toDTO(Flashcard flashcard);

    Flashcard toEntity(FlashcardCreateRequestDTO dto);
}

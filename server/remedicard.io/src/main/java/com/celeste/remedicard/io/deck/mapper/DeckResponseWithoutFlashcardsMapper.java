package com.celeste.remedicard.io.deck.mapper;

import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder=true))
public interface DeckResponseWithoutFlashcardsMapper {
    DeckResponseWithoutFlashcardsMapper INSTANCE = Mappers.getMapper(DeckResponseWithoutFlashcardsMapper.class);

    Set<DeckResponseWithoutFlashcardsDTO> toDTO(Set<Deck> deckSet);

    Deck toEntity(DeckResponseWithoutFlashcardsDTO dto);
}

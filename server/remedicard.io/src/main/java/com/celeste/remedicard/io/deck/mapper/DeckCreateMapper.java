package com.celeste.remedicard.io.deck.mapper;

import com.celeste.remedicard.io.deck.controller.dto.DeckCreateRequestDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DeckCreateMapper {

    DeckCreateMapper INSTANCE = Mappers.getMapper(DeckCreateMapper.class);

    DeckCreateRequestDTO toDTO(Deck deck);

    Deck toEntity(DeckCreateRequestDTO dto);
}

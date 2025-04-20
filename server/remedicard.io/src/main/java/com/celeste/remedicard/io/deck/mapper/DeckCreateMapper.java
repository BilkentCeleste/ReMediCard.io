package com.celeste.remedicard.io.deck.mapper;

import com.celeste.remedicard.io.deck.controller.dto.DeckCreateRequestDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface DeckCreateMapper {

    DeckCreateMapper INSTANCE = Mappers.getMapper(DeckCreateMapper.class);

    @Mapping(target = "userId", source = "user.id")
    DeckResponseDTO toDTO(Deck deck);

    Set<DeckResponseDTO> toDTO(Set<Deck> deckSet);

//    @Mapping(target = "user", ignore = true)
    Deck toEntity(DeckCreateRequestDTO dto);
}
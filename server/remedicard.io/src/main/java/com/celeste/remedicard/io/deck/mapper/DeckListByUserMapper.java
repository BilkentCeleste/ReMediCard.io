package com.celeste.remedicard.io.deck.mapper;

import com.celeste.remedicard.io.deck.controller.dto.DeckListByUserDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DeckListByUserMapper {

    DeckListByUserMapper INSTANCE = Mappers.getMapper(DeckListByUserMapper.class);

    DeckListByUserDTO toDTO(Deck deck);

    Deck toEntity(DeckListByUserDTO dto);

}

package com.celeste.remedicard.io.deckStats.mapper;

import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsCreateRequestDTO;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DeckStatsCreateRequestMapper {
    DeckStatsCreateRequestMapper INSTANCE = Mappers.getMapper(DeckStatsCreateRequestMapper.class);

    DeckStatsCreateRequestDTO toDTO(DeckStats deckStats);

    DeckStats toEntity(DeckStatsCreateRequestDTO dto);
}

package com.celeste.remedicard.io.deckStats.mapper;

import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseDTO;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface DeckStatsResponseMapper {
    DeckStatsResponseMapper INSTANCE = Mappers.getMapper(DeckStatsResponseMapper.class);

    DeckStatsResponseDTO toDTO(DeckStats deckStats);

    Set<DeckStatsResponseDTO> toDTO(Set<DeckStats> deckStats);

    DeckStats toEntity(DeckStatsResponseDTO dto);
}

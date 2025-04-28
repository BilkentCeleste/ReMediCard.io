package com.celeste.remedicard.io.deckStats.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsCreateRequestDTO;
import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseDTO;
import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseWithDeckNameDTO;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.mapper.DeckStatsCreateRequestMapper;
import com.celeste.remedicard.io.deckStats.mapper.DeckStatsResponseMapper;
import com.celeste.remedicard.io.deckStats.service.DeckStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/deckStats")
@RequiredArgsConstructor
public class DeckStatsController {

    private final DeckStatsService deckStatsService;
    private final CurrentUserService currentUserService;

    @PostMapping("/create")
    public ResponseEntity<Void> create(@RequestBody DeckStatsCreateRequestDTO dto) {
        DeckStats deckStats = DeckStatsCreateRequestMapper.INSTANCE.toEntity(dto);
        deckStatsService.create(deckStats, dto.getDeckId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getDeckStats/{deckId}")
    public Set<DeckStatsResponseDTO> getDeckStats(@PathVariable Long deckId) {
        Long userId = currentUserService.getCurrentUserId();
        Set<DeckStats> deckStats = deckStatsService.getDeckStatsByDeckIdAndUserId(deckId, userId);
        return DeckStatsResponseMapper.INSTANCE.toDTO(deckStats);
    }

    @GetMapping("/getRandomDeckStatsByCurrentUser")
    public DeckStatsResponseWithDeckNameDTO getRandomDeckStatsByCurrentUser() {
        return deckStatsService.getRandomDeckStatsByCurrentUser();
    }
}

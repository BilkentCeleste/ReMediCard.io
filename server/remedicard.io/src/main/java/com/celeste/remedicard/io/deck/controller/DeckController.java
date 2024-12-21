package com.celeste.remedicard.io.deck.controller;

import com.celeste.remedicard.io.deck.controller.dto.DeckCreateRequestDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.mapper.DeckCreateMapper;
import com.celeste.remedicard.io.deck.service.DeckService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/deck")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    @PostMapping("/create")
    public void create(@RequestBody DeckCreateRequestDTO dto) {
        Deck deck = DeckCreateMapper.INSTANCE.toEntity(dto);
        deckService.create(deck, dto.getUserId());
    }

    @GetMapping("/getByDeckId/{deckId}")
    public DeckResponseDTO getDeckByDeckId(@PathVariable Long deckId) {
        Deck deck = deckService.getDeckByDeckId(deckId);
        return DeckCreateMapper.INSTANCE.toDTO(deck);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<DeckResponseDTO> getDeckByUserId(@PathVariable Long userId) {
        Set<Deck> deckSet = deckService.getDeckByUserId(userId);
        return DeckCreateMapper.INSTANCE.toDTO(deckSet);
    }
}
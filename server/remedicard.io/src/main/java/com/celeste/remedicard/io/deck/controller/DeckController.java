package com.celeste.remedicard.io.deck.controller;

import com.celeste.remedicard.io.deck.controller.dto.DeckCreateRequestDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.mapper.DeckCreateMapper;
import com.celeste.remedicard.io.deck.mapper.DeckResponseWithoutFlashcardsMapper;
import com.celeste.remedicard.io.deck.service.DeckService;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.service.DeckStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/deck")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;
    private final DeckStatsService deckStatsService;

    @PostMapping("/create")
    public ResponseEntity<DeckResponseDTO> create(@RequestBody DeckCreateRequestDTO dto) {
        Deck deck = DeckCreateMapper.INSTANCE.toEntity(dto);
        deck = deckService.create(deck);
        return ResponseEntity.ok(DeckCreateMapper.INSTANCE.toDTO(deck, false));
    }

    @GetMapping("/getByCurrentUser")
    public Set<DeckResponseWithoutFlashcardsDTO> getDecksByCurrentUser() {
        Set<Deck> deckSet = deckService.getDeckByCurrentUser();
        return DeckResponseWithoutFlashcardsMapper.INSTANCE.toDTO(deckSet);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<DeckResponseWithoutFlashcardsDTO> getDecksByUserId(@PathVariable Long userId) {
        Set<Deck> deckSet = deckService.getDeckByUserId(userId);
        Set<DeckResponseWithoutFlashcardsDTO> response = DeckResponseWithoutFlashcardsMapper.INSTANCE.toDTO(deckSet);
        response.forEach(deck -> {
            DeckStats bestDeckStats = deckStatsService.getBestDeckStatsByDeckIdAndUserId(deck.getId(), userId);
            DeckStats lastDeckStats = deckStatsService.getLastDeckStatsByDeckIdAndUserId(deck.getId(), userId);
            deck.setBestSuccessRate(bestDeckStats.getSuccessRate());
            deck.setLastSuccessRate(lastDeckStats.getSuccessRate());
        });
        return response;
    }

    @GetMapping("/getByDeckId/{deckId}")
    public DeckResponseDTO getDeckByDeckId(@PathVariable Long deckId) {
        Deck deck = deckService.getDeckByDeckId(deckId);
        return DeckCreateMapper.INSTANCE.toDTO(deck, false);
    }

    @PostMapping(value = "/generate", consumes = "multipart/form-data")
    public ResponseEntity<String> generateDeck(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            long fileSize = file.getSize();

            //TODO ADD FILE TO RESPECTIVE PROCESSING QUEUE BASED ON THE FILE TYPE
            deckService.generateDeck(file);

            return ResponseEntity.ok("File uploaded successfully: " + fileName + " (" + fileSize + " bytes)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{deckId}")
    public ResponseEntity<Void> deleteDeck(@PathVariable Long deckId) {
        deckService.removeDeck(deckId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/share/{deckId}")
    public ResponseEntity<String> createShareLink(@PathVariable Long deckId) {
        String shareLink = deckService.createShareLink(deckId);
        return ResponseEntity.ok(shareLink);
    }

    @GetMapping("/shared/{shareToken}")
    public DeckResponseDTO getSharedDeck(@PathVariable String shareToken) {
        Deck deck = deckService.getSharedDeck(shareToken);
        return DeckCreateMapper.INSTANCE.toDTO(deck, true);
    }

//    @PostMapping("/shared/{shareToken}/copy")
//    public ResponseEntity<DeckResponseDTO> copySharedDeck(@PathVariable String shareToken) {
//        DeckResponseDTO copiedDeck = deckService.copySharedDeck(shareToken);
//        return ResponseEntity.ok(copiedDeck);
//    }
}

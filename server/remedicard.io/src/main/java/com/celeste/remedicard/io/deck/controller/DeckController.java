package com.celeste.remedicard.io.deck.controller;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.deck.controller.dto.DeckCreateRequestDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.mapper.DeckCreateMapper;
import com.celeste.remedicard.io.deck.service.DeckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/deck")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    @PostMapping("/create")
    public void create(@RequestBody DeckCreateRequestDTO dto) {
        Deck deck = DeckCreateMapper.INSTANCE.toEntity(dto);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        deckService.create(deck, user.getId());
    }

    @GetMapping("/getByCurrentUser")
    public Set<DeckResponseDTO> getDecksByUserId() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<Deck> deckSet = deckService.getDeckByUserId(user.getId());
        return DeckCreateMapper.INSTANCE.toDTO(deckSet);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<DeckResponseDTO> getDecksByUserId(@PathVariable Long userId) {
        Set<Deck> deckSet = deckService.getDeckByUserId(userId);
        return DeckCreateMapper.INSTANCE.toDTO(deckSet);
    }

    @GetMapping("/getByDeckId/{deckId}")
    public DeckResponseDTO getDeckByDeckId(@PathVariable Long deckId) {
        Deck deck = deckService.getDeckByDeckId(deckId);
        return DeckCreateMapper.INSTANCE.toDTO(deck);
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

}

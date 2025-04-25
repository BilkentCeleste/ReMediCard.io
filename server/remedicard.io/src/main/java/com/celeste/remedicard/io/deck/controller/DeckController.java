package com.celeste.remedicard.io.deck.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.common.config.enumeration.SortingOption;
import com.celeste.remedicard.io.deck.controller.dto.*;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.mapper.DeckCreateMapper;
import com.celeste.remedicard.io.deck.mapper.DeckResponseWithoutFlashcardsMapper;
import com.celeste.remedicard.io.deck.service.DeckService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/deck")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;
    private final CurrentUserService currentUserService;

    @PostMapping("/create")
    public ResponseEntity<DeckResponseDTO> create(@RequestBody DeckCreateRequestDTO dto) {
        Deck deck = DeckCreateMapper.INSTANCE.toEntity(dto);
        deck = deckService.create(deck);
        return ResponseEntity.ok(DeckCreateMapper.INSTANCE.toDTO(deck));
    }

    @GetMapping("/getByCurrentUser")
    public Set<DeckResponseWithoutFlashcardsDTO> getDecksByCurrentUser() {
        Set<Deck> deckSet = deckService.getDeckByCurrentUser();
        Long userId = currentUserService.getCurrentUserId();
        return deckService.convertFromDeckToDeckResponseWithoutFlashcardsDTO(deckSet, userId);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<DeckResponseWithoutFlashcardsDTO> getDecksByUserId(@PathVariable Long userId) {
        Set<Deck> deckSet = deckService.getDeckByUserId(userId);
        return deckService.convertFromDeckToDeckResponseWithoutFlashcardsDTO(deckSet, userId);
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

    @DeleteMapping("/delete/{deckId}")
    public ResponseEntity<Void> deleteDeck(@PathVariable Long deckId) {
        deckService.removeDeck(deckId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/addUserDeck/{deckId}")
    public void addUserDeck(@PathVariable Long deckId) {
        deckService.addUserDeck(deckId);
    }


    @PatchMapping("/change_public_visibility/{deckId}")
    public void changePublicVisibility(@PathVariable Long deckId) {
        deckService.changePublicVisibility(deckId);
    }

    @PatchMapping("/like_deck/{deckId}")
    public void likeDeck(@PathVariable Long deckId) {
        deckService.addLikeToDeck(deckId);
    }

    @PatchMapping("/unlike_deck/{deckId}")
    public void unlikeDeck(@PathVariable Long deckId) {
        deckService.removeLikeFromDeck(deckId);
    }

    @PatchMapping("/dislike_deck/{deckId}")
    public void dislikeDeck(@PathVariable Long deckId) {deckService.addDisLikeToDeck(deckId);}

    @PatchMapping("/undislike_deck/{deckId}")
    public void unDislikeDeck(@PathVariable Long deckId) {
        deckService.removeDisLikeFromDeck(deckId);
    }

    @GetMapping("/discover/{sorting_option}")
    public List<DeckExploreResponseDTO> discoverDecks(@PathVariable SortingOption sorting_option) {
        List<Deck> decks = deckService.discoverDecks(sorting_option);
        Long userId = currentUserService.getCurrentUserId();

        return deckService.convertFromDeckToDeckExploreResponseDTO(decks, userId);
    }

    @PostMapping("/generateShareToken/{deckId}")
    public String generateShareToken(@PathVariable Long deckId) {
        return deckService.generateShareToken(deckId);
    }

    @GetMapping("/getByShareToken/{shareToken}")
    public DeckResponseDTO getByShareToken(@PathVariable String shareToken) {
        Deck deck = deckService.getByShareToken(shareToken);
        return DeckCreateMapper.INSTANCE.toDTO(deck);
    }

    @PutMapping("/updateName/{deckId}")
    public DeckResponseDTO updateDeckName(@PathVariable Long deckId, @RequestBody UpdateDeckNameRequestDTO dto) {
        Deck updatedDeck = deckService.updateDeckName(deckId, dto.getName());
        return DeckCreateMapper.INSTANCE.toDTO(updatedDeck);
    }
}

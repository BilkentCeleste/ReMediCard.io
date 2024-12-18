package com.celeste.remedicard.io.flashcard.controller;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardCreateMapper;
import com.celeste.remedicard.io.flashcard.service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flashcard")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @PostMapping("/create")
    public void create(@RequestBody FlashcardCreateRequestDTO dto, @RequestParam Long deckId) {
        Flashcard flashcard = FlashcardCreateMapper.INSTANCE.toEntity(dto);

        flashcardService.create(
                flashcard,
                dto.getDeckId(),
                dto.getFrontText(),
                dto.getBackText(),
                dto.getFrontUrls(),
                dto.getBackUrls());
    }
}

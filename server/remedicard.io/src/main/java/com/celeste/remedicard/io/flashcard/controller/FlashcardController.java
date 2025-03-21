package com.celeste.remedicard.io.flashcard.controller;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardCreateMapper;
import com.celeste.remedicard.io.flashcard.service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flashcard")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @PostMapping("/create")
    public void create(@RequestBody FlashcardCreateRequestDTO dto) {
        Flashcard flashcard = FlashcardCreateMapper.INSTANCE.toEntity(dto);
        flashcardService.create(flashcard, dto.getDeckId());
    }

    @DeleteMapping("/delete/{flashcardId}")
    public void delete(@PathVariable Long flashcardId) {
        flashcardService.delete(flashcardId);
    }

    @PutMapping("/update/{flashcardId}")
    public void update(@RequestBody FlashcardCreateRequestDTO dto, @PathVariable Long flashcardId) {
        Flashcard flashcard = FlashcardCreateMapper.INSTANCE.toEntity(dto);
        flashcardService.update(flashcard, flashcardId);
    }
}

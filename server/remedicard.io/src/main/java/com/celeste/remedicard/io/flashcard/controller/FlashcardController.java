package com.celeste.remedicard.io.flashcard.controller;

import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardCreateMapper;
import com.celeste.remedicard.io.flashcard.service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/flashcard")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void create(@ModelAttribute FlashcardCreateRequestDTO dto) throws IOException {
        Flashcard flashcard = FlashcardCreateMapper.INSTANCE.toEntity(dto);
        flashcardService.create(flashcard, dto.getDeckId(), dto.getFrontSide().getImage(), dto.getBackSide().getImage());
    }

    @GetMapping("/getFlashcardsInBatch/{deckId}")
    public List<FlashcardResponseDTO> getFlashcardsInBatch(@PathVariable Long deckId) {
        return flashcardService.getFlashcardsInBatch(deckId);
    }
    
    @PostMapping("/updateFlashcardReviews")
    public void updateFlashcardReviews(@RequestBody List<FlashcardReviewDTO> reviews) {
        flashcardService.updateFlashcardReviews(reviews);
    }

    @DeleteMapping("/delete/{flashcardId}")
    public void delete(@PathVariable Long flashcardId) {
        flashcardService.delete(flashcardId);
    }

    @PutMapping(value = "/update/{flashcardId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void update(@ModelAttribute FlashcardCreateRequestDTO dto, @PathVariable Long flashcardId) throws IOException {
        flashcardService.update(dto, flashcardId);
    }
}

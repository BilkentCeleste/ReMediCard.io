package com.celeste.remedicard.io.flashcard.service;

import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    public void create(Flashcard flashcard) {
        flashcardRepository.save(flashcard);
    }
}

package com.celeste.remedicard.io.flashcard.service;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.cloud.service.S3Service;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardCreateRequestDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.repository.FlashcardRepository;
import com.celeste.remedicard.io.search.service.SearchService;
import com.celeste.remedicard.io.spacedrepetition.service.SpacedRepetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;
    private final SpacedRepetitionService spacedRepetitionService;
    private final CurrentUserService currentUserService;
    private final SearchService searchService;
    private final SideService sideService;
    private final S3Service s3Service;

    public void create(Flashcard flashcard, Long deckId, MultipartFile frontImage, MultipartFile backImage) throws IOException {
        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
        flashcard.setDeck(deck);
        deck.setFlashcardCount(deck.getFlashcardCount() + 1);
        deckRepository.save(deck);
        flashcardRepository.save(flashcard);

        if(frontImage != null){
            sideService.uploadImage(flashcard.getFrontSide(), frontImage.getInputStream(), frontImage.getSize(), frontImage.getOriginalFilename());
        }
        if(backImage != null){
            sideService.uploadImage(flashcard.getBackSide(), backImage.getInputStream(), backImage.getSize(), backImage.getOriginalFilename());
        }

        spacedRepetitionService.create(deck.getUser(), flashcard);
        searchService.addSearchableFlashcard(deck.getId(), flashcard);
    }

    public List<FlashcardResponseDTO> getFlashcardsInBatch(Long deckId) {
        Long userId = currentUserService.getCurrentUserId();
        return spacedRepetitionService.getFlashcardsInBatch(userId, deckId, 20);
    }

    public void updateFlashcardReviews(List<FlashcardReviewDTO> reviews){
        Long userId = currentUserService.getCurrentUserId();
        spacedRepetitionService.updateFlashcardReviews(userId, reviews);
    }

    public void delete(Long flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId).orElseThrow(() -> new RuntimeException("Flashcard not found"));
        Deck deck = flashcard.getDeck();
        deck.setFlashcardCount(deck.getFlashcardCount() - 1);
        deckRepository.save(deck);

        // delete images from S3
        String frontImageUrl = flashcard.getFrontSide().getImageURL();
        String backImageUrl = flashcard.getBackSide().getImageURL();
        if(frontImageUrl != null) {
            s3Service.deleteFile(frontImageUrl);
        }
        if(backImageUrl != null) {
            s3Service.deleteFile(backImageUrl);
        }

        flashcardRepository.deleteById(flashcardId);
        searchService.removeSearchableFlashcard(deck.getId(), flashcard);
    }

    public void update(FlashcardCreateRequestDTO dto, Long flashcardId) throws IOException {
        Flashcard flashcardToUpdate = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        flashcardToUpdate.setTopic(dto.getTopic());
        flashcardToUpdate.setType(dto.getType());
        flashcardToUpdate.setFrequency(dto.getFrequency());

        flashcardToUpdate.getFrontSide().setText(dto.getFrontSide().getText());
        flashcardToUpdate.getBackSide().setText(dto.getBackSide().getText());
        flashcardToUpdate.getFrontSide().setUrlSet(dto.getFrontSide().getUrlSet());
        flashcardToUpdate.getBackSide().setUrlSet(dto.getBackSide().getUrlSet());
        if (dto.getFrontSide().getImage() != null) {
            MultipartFile frontImage = dto.getFrontSide().getImage();
            sideService.uploadImage(flashcardToUpdate.getFrontSide(), frontImage.getInputStream(), frontImage.getSize(), frontImage.getOriginalFilename());
        }
        if (dto.getBackSide().getImage() != null) {
            MultipartFile backImage = dto.getBackSide().getImage();
            sideService.uploadImage(flashcardToUpdate.getBackSide(), backImage.getInputStream(), backImage.getSize(), backImage.getOriginalFilename());
        }

        flashcardRepository.save(flashcardToUpdate);
    }
}

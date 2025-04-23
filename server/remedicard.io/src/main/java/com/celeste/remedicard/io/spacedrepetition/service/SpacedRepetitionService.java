package com.celeste.remedicard.io.spacedrepetition.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardResponseMapper;
import com.celeste.remedicard.io.spacedrepetition.entity.SpacedRepetition;
import com.celeste.remedicard.io.spacedrepetition.repository.SpacedRepetitionRepository;
import com.celeste.remedicard.io.spacedrepetition.utils.EbisuUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import me.aldebrn.ebisu.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpacedRepetitionService {

    private final SpacedRepetitionRepository spacedRepetitionRepository;

    public void create(User user, Flashcard flashcard) {
        SpacedRepetition spacedRepetition = new SpacedRepetition();
        spacedRepetition.setUser(user);
        spacedRepetition.setFlashcard(flashcard);
        spacedRepetition.setModel(EbisuUtils.defaultEbisuModel());
        spacedRepetition.setLastReviewed(LocalDateTime.now(ZoneId.of("UTC")));
        spacedRepetitionRepository.save(spacedRepetition);
    }

    @Transactional
    public List<FlashcardResponseDTO> getFlashcardsInBatch(Long userId, Long deckId, int batchSize) {
        List<SpacedRepetition> spacedRepetitions = spacedRepetitionRepository.findByUserIdAndDeckId(userId, deckId);

        return spacedRepetitions.stream()
                .map(sr -> {
                    FlashcardResponseDTO flashcardResponseDTO = FlashcardResponseMapper.INSTANCE.toDTO(sr.getFlashcard());
                    EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
                    double timeDifference = Math.ceil(Duration.between(sr.getLastReviewed(), LocalDateTime.now(ZoneId.of("UTC"))).toSeconds() / 60.0 + 1e-2);
                    flashcardResponseDTO.setRecallProbability(Ebisu.predictRecall(model, timeDifference, true));
                    return flashcardResponseDTO;
                })
                .sorted(Comparator.comparing(FlashcardResponseDTO::getRecallProbability))
                .limit(batchSize)
                .toList();
    }

    @Transactional
    public void updateFlashcardReviews(Long userId, List<FlashcardReviewDTO> reviews) {
        System.out.println(reviews);
        for (FlashcardReviewDTO review : reviews) {
            SpacedRepetition sr = spacedRepetitionRepository
                    .findByUserIdAndFlashcardId(userId, review.getId());

            int success = switch (review.getResult()){
                case CORRECT -> 2;
                case PARTIALLY_CORRECT -> 1;
                case INCORRECT -> 0;
            };

            LocalDateTime lastReviewedTime = sr.getLastReviewed();
            LocalDateTime reviewTime = review.getLastReviewed();

            double timeDifference = Duration.between(lastReviewedTime, reviewTime).toSeconds() / 60.0 + 1e-2;

            EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
            EbisuInterface updatedModel = Ebisu.updateRecall(model, success, 2, timeDifference);

            sr.setModel(EbisuUtils.toJson((EbisuModel) updatedModel));
            sr.setLastReviewed(reviewTime);

            spacedRepetitionRepository.save(sr);
        }
    }
}

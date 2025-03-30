package com.celeste.remedicard.io.spacedRepetition.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardResponseMapper;
import com.celeste.remedicard.io.spacedRepetition.entity.SpacedRepetition;
import com.celeste.remedicard.io.spacedRepetition.repository.SpacedRepetitionRepository;
import com.celeste.remedicard.io.spacedRepetition.utils.EbisuUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
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
        spacedRepetition.setLastReviewed(LocalDateTime.now(ZoneId.of("UTC")));  // use UTC time zone
        spacedRepetitionRepository.save(spacedRepetition);
    }

    @Transactional
    public List<FlashcardResponseDTO> getFlashcardsInBatch(Long userId, Long deckId, int batchSize) {
        List<SpacedRepetition> spacedRepetitions = spacedRepetitionRepository.findByUserIdAndDeckId(userId, deckId);

        // caculate recall probability for each flashcard and return the bottom batchSize flashcards
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

            int success = review.isCorrect() ? 1 : 0;


            LocalDateTime lastReviewedTime = sr.getLastReviewed();
            LocalDateTime reviewTime = review.getLastReviewed();    // frontend returns time in UTC

            // time difference in minutes
            double timeDifference = Duration.between(lastReviewedTime, reviewTime).toSeconds() / 60.0 + 1e-2; // add small value to avoid zero case

            System.out.println("Last reviewed: " + lastReviewedTime);
            System.out.println("Review time: " + reviewTime);
            System.out.println("Time difference: " + timeDifference);
            System.out.println("success: " + success);

            EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
            EbisuInterface updatedModel = Ebisu.updateRecall(model, success, 1, timeDifference);


            System.out.println("Model: " + model);
            System.out.println("Updated model: " + updatedModel);

            sr.setModel(EbisuUtils.toJson((EbisuModel) updatedModel));
            sr.setLastReviewed(reviewTime);

            spacedRepetitionRepository.save(sr);
        }
    }

}

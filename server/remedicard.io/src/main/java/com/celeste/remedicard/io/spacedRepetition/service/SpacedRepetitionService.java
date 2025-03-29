package com.celeste.remedicard.io.spacedRepetition.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardResponseDTO;
import com.celeste.remedicard.io.flashcard.controller.dto.FlashcardReviewDTO;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.mapper.FlashcardResponseMapper;
import com.celeste.remedicard.io.spacedRepetition.controller.dto.FlashcardForStudyDTO;
import com.celeste.remedicard.io.spacedRepetition.entity.SpacedRepetition;
import com.celeste.remedicard.io.spacedRepetition.mapper.FlashcardForStudyDTOMapper;
import com.celeste.remedicard.io.spacedRepetition.repository.SpacedRepetitionRepository;
import com.celeste.remedicard.io.spacedRepetition.utils.EbisuUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import me.aldebrn.ebisu.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpacedRepetitionService {

    private final SpacedRepetitionRepository spacedRepetitionRepository;

    public void create(User user, Flashcard flashcard) {
        SpacedRepetition spacedRepetition = new SpacedRepetition();
        spacedRepetition.setUser(user);
        spacedRepetition.setFlashcard(flashcard);
        spacedRepetition.setModel(EbisuUtils.defaultEbisuModel());
        spacedRepetition.setRecallProbability(1);
        spacedRepetition.setLastReviewed(LocalDateTime.now());
        spacedRepetitionRepository.save(spacedRepetition);
    }

    @Transactional
    public List<FlashcardResponseDTO> getFlashcardsInBatch(Long userId, Long deckId, int batchSize) {
        List<SpacedRepetition> spacedRepetitions = spacedRepetitionRepository.findByUserIdAndDeckId(userId, deckId);
        return spacedRepetitions.stream()
                .map(sr -> {
                    FlashcardResponseDTO flashcardResponseDTO = FlashcardResponseMapper.INSTANCE.toDTO(sr.getFlashcard());

                    EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
                    double timeDifference = Duration.between(sr.getLastReviewed(), LocalDateTime.now()).toMinutes() / 60.0 + 1e-6;

                    flashcardResponseDTO.setRecallProbability(Ebisu.predictRecall(model, timeDifference, true));
                    return flashcardResponseDTO;
                })
                .sorted(Comparator.comparing(FlashcardResponseDTO::getRecallProbability))
                .limit(batchSize)
                .toList();
    }

    @Transactional
    public void updateRecallProbabilities(Long userId, Long deckId){
        List<SpacedRepetition> spacedRepetitions = spacedRepetitionRepository
                .findByUserIdAndDeckId(userId, deckId);
        for (SpacedRepetition sr : spacedRepetitions) {
            EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
            double timeDifference = Duration.between(sr.getLastReviewed(), LocalDateTime.now()).toMinutes() / 60.0 + 1e-6;

            sr.setRecallProbability(Ebisu.predictRecall(model, timeDifference, true));
            spacedRepetitionRepository.save(sr);
        }
    }

    @Transactional
    public void updateFlashcardReviews(Long userId, List<FlashcardReviewDTO> reviews) {
        System.out.println(reviews);
        for (FlashcardReviewDTO review : reviews) {
            SpacedRepetition sr = spacedRepetitionRepository
                    .findByUserIdAndFlashcardId(userId, review.getId());

            int success = review.isCorrect() ? 1 : 0;

            LocalDateTime lastReviewedTime = sr.getLastReviewed();
            LocalDateTime reviewTime = review.getLastReviewed();

            // time difference in hours
            double timeDifference = Duration.between(lastReviewedTime, reviewTime).toMinutes() / 60.0 + 1e-6;

            EbisuInterface model = EbisuUtils.fromJson(sr.getModel());
            EbisuInterface updatedModel = Ebisu.updateRecall(model, success, 1, timeDifference);

            sr.setModel(EbisuUtils.toJson((EbisuModel) updatedModel));
            sr.setLastReviewed(reviewTime);

            spacedRepetitionRepository.save(sr);
        }
    }

}

package com.celeste.remedicard.io.quizStats.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deckStats.controller.dto.DeckStatsResponseWithDeckNameDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsResponseWithQuizNameDTO;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import com.celeste.remedicard.io.quizStats.repository.QuizStatsRepository;
import com.celeste.remedicard.io.studyGoals.service.StudyGoalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuizStatsService {
    private final QuizStatsRepository quizStatsRepository;
    private final QuizRepository quizRepository;
    private final CurrentUserService currentUserService;
    private final StudyGoalsService studyGoalsService;

    public void create(QuizStats quizStats, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Deck not found"));
        User user = currentUserService.getCurrentUser();

        quizStats.setQuiz(quiz);
        quizStats.setUser(user);
        quizStats.setAccessDate(LocalDateTime.now());
        quizStatsRepository.save(quizStats);

        studyGoalsService.checkIsGoalCompleted(user.getId(), quiz.getId(), quizStats.getSuccessRate());
    }

    public void delete(Long quizStatsId) {
        QuizStats quizStats = quizStatsRepository.findById(quizStatsId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"));
        quizStatsRepository.delete(quizStats);
    }

    public Set<QuizStats> getQuizStatsByQuizIdAndUserId(Long quizId, Long userId) {
        return quizStatsRepository.findByQuizIdAndUserId(quizId, userId)
                .orElseThrow(() -> new RuntimeException("Deck stats not found"));
    }

    public QuizStats getBestQuizStatsByQuizIdAndUserId(Long quizId, Long userId) {
        return quizStatsRepository.findBestByQuizIdAndUserId(quizId, userId).orElse(null);
    }

    public QuizStats getLastQuizStatsByQuizIdAndUserId(Long quizId, Long userId) {
        return quizStatsRepository.findLastByQuizIdAndUserId(quizId, userId).orElse(null);
    }

    public QuizStatsResponseWithQuizNameDTO getRandomQuizStatsByCurrentUser() {
        Long userId = currentUserService.getCurrentUserId();
        QuizStats quizStats = quizStatsRepository.getRandomByUserId(userId).orElse(null);
        if(quizStats == null ){
            return null;
        }
        QuizStatsResponseWithQuizNameDTO dto = new QuizStatsResponseWithQuizNameDTO();
        dto.setQuizName(quizStats.getQuiz().getName());
        dto.setQuizId(quizStats.getQuiz().getId());
        dto.setSuccessRate(quizStats.getSuccessRate());
        dto.setAccessDate(quizStats.getAccessDate());
        return dto;
    }
}

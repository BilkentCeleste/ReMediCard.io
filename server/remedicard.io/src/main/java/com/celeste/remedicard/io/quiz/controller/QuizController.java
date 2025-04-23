package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.quiz.controller.dto.*;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuizCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizResponseMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizzesResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuizService;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import com.celeste.remedicard.io.quizStats.mapper.QuizStatsResponseMapper;
import com.celeste.remedicard.io.quizStats.service.QuizStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final CurrentUserService currentUserService;
    private final QuizStatsService quizStatsService;

    @GetMapping("/get/{quizId}")
    public QuizResponseDTO getById(@PathVariable Long quizId) {
        Quiz quiz = quizService.getById(quizId);
        return QuizResponseMapper.INSTANCE.toDTO(quiz);
    }

    @GetMapping("/getByCurrentUser")
    public Set<QuizResponseWithoutQuestionsDTO> getByCurrentUser() {
        Set<Quiz> quizSet = quizService.getByCurrentUserId();
        Set<QuizResponseWithoutQuestionsDTO> response = QuizzesResponseMapper.INSTANCE.toDTO(quizSet);
        Long userId = currentUserService.getCurrentUserId();
        response.forEach(quiz -> {
            QuizStats bestQuizStats = quizStatsService.getBestQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            QuizStats lastQuizStats = quizStatsService.getLastQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            quiz.setBestQuizStat(bestQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(bestQuizStats) : null);
            quiz.setLastQuizStat(lastQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(lastQuizStats) : null);
        });
        return response;
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<QuizResponseWithoutQuestionsDTO> getByUserId(@PathVariable Long userId) {
        Set<Quiz> quizSet = quizService.getByUserId(userId);
        Set<QuizResponseWithoutQuestionsDTO> response = QuizzesResponseMapper.INSTANCE.toDTO(quizSet);
        response.forEach(quiz -> {
            QuizStats bestQuizStats = quizStatsService.getBestQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            QuizStats lastQuizStats = quizStatsService.getLastQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            quiz.setBestQuizStat(bestQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(bestQuizStats) : null);
            quiz.setLastQuizStat(lastQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(lastQuizStats) : null);
        });
        return response;
    }

    @PostMapping("/create")
    public QuizResponseDTO create(@RequestBody QuizCreateRequestDTO dto) {
        Quiz quiz = QuizCreateMapper.INSTANCE.toEntity(dto);
        Quiz createdQuiz = quizService.create(quiz);
        return QuizResponseMapper.INSTANCE.toDTO(createdQuiz);
    }

    @DeleteMapping("/delete/{quizId}")
    public void delete(@PathVariable Long quizId) {
        quizService.delete(quizId);
    }

    @PostMapping("/addUserQuiz/{quizId}")
    public void addUserQuiz(@PathVariable Long quizId) {
        quizService.addUserQuiz(quizId);
    }

    @PostMapping("/generateShareToken/{quizId}")
    public String generateShareToken(@PathVariable Long quizId) {
        return quizService.generateShareToken(quizId);
    }

    @GetMapping("/getByShareToken/{shareToken}")
    public QuizResponseDTO getByShareToken(@PathVariable String shareToken) {
        Quiz quiz = quizService.getByShareToken(shareToken);
        return QuizResponseMapper.INSTANCE.toDTO(quiz);
    }

//    @PutMapping("/update/{quizId}")
//    public void update(@RequestBody QuizCreateRequestDTO dto, @PathVariable Long quizId) {
//        Quiz quiz = QuizCreateMapper.INSTANCE.toEntity(dto);
//        quizService.update(quiz, quizId);
//    }
}

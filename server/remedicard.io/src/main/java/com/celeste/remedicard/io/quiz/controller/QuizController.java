package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.common.config.enumeration.SortingOption;
import com.celeste.remedicard.io.quiz.controller.dto.*;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuizCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizResponseMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizzesResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final CurrentUserService currentUserService;

    @GetMapping("/get/{quizId}")
    public QuizResponseDTO getById(@PathVariable Long quizId) {
        Quiz quiz = quizService.getById(quizId);
        return QuizResponseMapper.INSTANCE.toDTO(quiz);
    }

    @GetMapping("/getByCurrentUser")
    public Set<QuizResponseWithoutQuestionsDTO> getByCurrentUser() {
        Set<Quiz> quizSet = quizService.getByCurrentUserId();
        Long userId = currentUserService.getCurrentUserId();
        return quizService.convertFromQuizToQuizResponseWithoutFlashcardsDTO(quizSet, userId);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<QuizResponseWithoutQuestionsDTO> getByUserId(@PathVariable Long userId) {
        Set<Quiz> quizSet = quizService.getByUserId(userId);
        return quizService.convertFromQuizToQuizResponseWithoutFlashcardsDTO(quizSet, userId);
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

    @PatchMapping("/change_public_visibility/{quizId}")
    public void changePublicVisibility(@PathVariable Long quizId) {
        quizService.changePublicVisibility(quizId);
    }

    @PatchMapping("/like_quiz/{quizId}")
    public QuizExploreResponseDTO likeQuiz(@PathVariable Long quizId) {
        Quiz quiz = quizService.likeQuiz(quizId);
        Long userId = currentUserService.getCurrentUserId();

        return quizService.convertFromQuizToQuizExploreResponseDTO(List.of(quiz), userId).get(0);
    }

    @PatchMapping("/dislike_quiz/{quizId}")
    public QuizExploreResponseDTO dislikeQuiz(@PathVariable Long quizId) {
        Quiz quiz = quizService.dislikeQuiz(quizId);
        Long userId = currentUserService.getCurrentUserId();

        return quizService.convertFromQuizToQuizExploreResponseDTO(List.of(quiz), userId).get(0);}

    @GetMapping("/discover/{sorting_option}")
    public List<QuizExploreResponseDTO> discoverQuizzes(@PathVariable SortingOption sorting_option) {
        List<Quiz> quizzes =  quizService.discoverQuizzes(sorting_option);
        Long userId = currentUserService.getCurrentUserId();
        return quizService.convertFromQuizToQuizExploreResponseDTO(quizzes, userId);
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

    @PutMapping("/updateName/{quizId}")
    public QuizResponseDTO updateQuizName(@PathVariable Long quizId, @RequestBody UpdateQuizNameRequestDTO dto) {
        Quiz updatedQuiz = quizService.updateQuizName(quizId, dto.getName());
        return QuizResponseMapper.INSTANCE.toDTO(updatedQuiz);
    }
}

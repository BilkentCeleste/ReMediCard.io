package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.quiz.controller.dto.*;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuizCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizResponseMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizzesResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/get/{quizId}")
    public QuizResponseDTO getById(@PathVariable Long quizId) {
        Quiz quiz = quizService.getById(quizId);
        return QuizResponseMapper.INSTANCE.toDTO(quiz);
    }

    @GetMapping("/getByCurrentUser")
    public Set<QuizzesResponseDTO> getByCurrentUser() {
        Set<Quiz> quizSet = quizService.getByCurrentUserId();
        return QuizzesResponseMapper.INSTANCE.toDTO(quizSet);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<QuizzesResponseDTO> getByUserId(@PathVariable Long userId) {
        Set<Quiz> quizSet = quizService.getByUserId(userId);
        return QuizzesResponseMapper.INSTANCE.toDTO(quizSet);
    }

    @PostMapping("/create")
    public QuizResponseDTO create(@RequestBody QuizCreateRequestDTO dto) {
        Quiz quiz = QuizCreateMapper.INSTANCE.toEntity(dto);
        Quiz createdQuiz = quizService.create(quiz);
        return QuizResponseMapper.INSTANCE.toDTO(createdQuiz);
    }

    @PostMapping("/addQuestion/{quizId}")
    public void addQuestion(@RequestBody AddQuestionRequestDTO dto, @PathVariable Long quizId) {
        quizService.addQuestion(dto.getQuestionId(), quizId);
    }

    @PostMapping("/removeQuestion/{quizId}")
    public void removeQuestion(@RequestBody RemoveQuestionRequestDTO dto, @PathVariable Long quizId) {
            quizService.removeQuestion(dto.getQuestionId(), quizId);
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
    public ShareQuizResponseDTO generateShareToken(@PathVariable Long quizId) {
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

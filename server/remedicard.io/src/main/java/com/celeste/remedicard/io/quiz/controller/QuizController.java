package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.quiz.controller.dto.AddQuestionRequestDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuizCreateRequestDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuizResponseDTO;
import com.celeste.remedicard.io.quiz.controller.dto.RemoveQuestionRequestDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuizCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuizResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public Set<QuizResponseDTO> getByCurrentUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<Quiz> quizSet = quizService.getByUserId(user.getId());
        return QuizResponseMapper.INSTANCE.toDTO(quizSet);
    }

    @GetMapping("/getByUserId/{userId}")
    public Set<QuizResponseDTO> getByUserId(@PathVariable Long userId) {
        Set<Quiz> quizSet = quizService.getByUserId(userId);
        return QuizResponseMapper.INSTANCE.toDTO(quizSet);
    }

    @PostMapping("/create")
    public void create(@RequestBody QuizCreateRequestDTO dto) {
        Quiz quiz = QuizCreateMapper.INSTANCE.toEntity(dto);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quizService.create(quiz, user.getId());
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
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quizService.addUserQuiz(quizId, user.getId());
    }

    @DeleteMapping("/deleteUserQuiz/{quizId}")
    public void deleteUserQuiz(@PathVariable Long quizId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        quizService.deleteUserQuiz(quizId, user.getId());
    }

//    @PutMapping("/update/{quizId}")
//    public void update(@RequestBody QuizCreateRequestDTO dto, @PathVariable Long quizId) {
//        Quiz quiz = QuizCreateMapper.INSTANCE.toEntity(dto);
//        quizService.update(quiz, quizId);
//    }
}

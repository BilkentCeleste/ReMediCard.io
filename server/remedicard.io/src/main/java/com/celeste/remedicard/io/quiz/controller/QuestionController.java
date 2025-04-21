package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.quiz.controller.dto.QuestionCreateRequestDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuestionResponseDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuestionCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuestionResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuestionService;
import com.celeste.remedicard.io.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final QuizService quizService;

    @GetMapping("/get/{questionId}")
    public QuestionResponseDTO getById(@PathVariable Long questionId) {
        Question question = questionService.getById(questionId);
        return QuestionResponseMapper.INSTANCE.toDTO(question);
    }

    @PostMapping("/create")
    public QuestionResponseDTO create(@RequestBody QuestionCreateRequestDTO dto) {
        Quiz quiz = quizService.getById(dto.getQuizId());
        Question question = QuestionCreateMapper.INSTANCE.toEntity(dto);
        Question createdQuestion = questionService.create(question, quiz);
        return QuestionResponseMapper.INSTANCE.toDTO(createdQuestion);
    }

    @DeleteMapping("/delete/{questionId}")
    public void delete(@PathVariable Long questionId) {
        questionService.delete(questionId);
    }

    @PutMapping("/update/{questionId}")
    public void update(@RequestBody QuestionCreateRequestDTO dto, @PathVariable Long questionId) {
        Question question = QuestionCreateMapper.INSTANCE.toEntity(dto);
        questionService.update(question, questionId);
    }
}

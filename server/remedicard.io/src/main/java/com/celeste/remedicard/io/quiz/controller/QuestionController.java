package com.celeste.remedicard.io.quiz.controller;

import com.celeste.remedicard.io.quiz.controller.dto.QuestionCreateRequestDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuestionResponseDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.mapper.QuestionCreateMapper;
import com.celeste.remedicard.io.quiz.mapper.QuestionResponseMapper;
import com.celeste.remedicard.io.quiz.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/get/{questionId}")
    public QuestionResponseDTO getById(@PathVariable Long questionId) {
        Question question = questionService.getById(questionId);
        return QuestionResponseMapper.INSTANCE.toDTO(question);
    }

    @PostMapping("/create")
    public void create(@RequestBody QuestionCreateRequestDTO dto) {
        Question question = QuestionCreateMapper.INSTANCE.toEntity(dto);
        questionService.create(question);
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

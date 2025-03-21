package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public void create(Question question) {
        questionRepository.save(question);
    }

    public void delete(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    public void update(Question question, Long questionId) {
        Question questionToUpdate = questionRepository.findById(questionId).orElseThrow();
        BeanUtils.copyProperties(question, questionToUpdate, "id");
        questionRepository.save(questionToUpdate);
    }

    public Question getById(Long questionId) {
        return questionRepository.findById(questionId).orElseThrow();
    }
}

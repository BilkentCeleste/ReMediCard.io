package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.repository.QuestionRepository;
import com.celeste.remedicard.io.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SearchService searchService;

    public void create(Question question) {
        questionRepository.save(question);
        searchService.addSearchableQuestion(question.getQuiz().getId(), question);
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
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
    }
}

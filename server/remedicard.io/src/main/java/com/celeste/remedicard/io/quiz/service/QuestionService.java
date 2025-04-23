package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuestionRepository;
import com.celeste.remedicard.io.search.entity.SearchableQuestion;
import com.celeste.remedicard.io.search.entity.SearchableQuiz;
import com.celeste.remedicard.io.search.repository.SearchableQuizRepository;
import com.celeste.remedicard.io.search.service.SearchService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SearchableQuizRepository searchableQuizRepository;
    private final SearchService searchService;

    @Transactional
    public Question create(Question question, Quiz quiz) {
        question.setQuiz(quiz);
        question = questionRepository.save(question);
        quiz.addQuestion(question);
        addSearchableQuestion(quiz.getId(), question);
        return question;
    }

    @Transactional
    public void delete(Long questionId) {
        Question question = getById(questionId);
        Quiz quiz = question.getQuiz();
        if (quiz != null) {
            quiz.removeQuestion(question);
            removeSearchableQuestion(quiz.getId(), question);
            questionRepository.delete(question);
        }
    }

    public void update(Question question, Long questionId) {
        Question questionToUpdate = questionRepository.findById(questionId).orElseThrow();
        BeanUtils.copyProperties(question, questionToUpdate, "id", "quiz");
        questionRepository.save(questionToUpdate);
    }

    public Question getById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));
    }

    public void addSearchableQuestion(Long id, Question question) {
        SearchableQuiz searchableQuiz = searchableQuizRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableQuiz.getQuestions().add(SearchableQuestion.builder()
                .id(question.getId())
                .description(question.getDescription())
                .options(question.getOptions())
                .build());

        searchableQuizRepository.save(searchableQuiz);
    }

    public void removeSearchableQuestion(Long id, Question question) {
        SearchableQuiz searchableQuiz = searchableQuizRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableQuiz.setQuestions(searchableQuiz.getQuestions().stream().filter(
                searchableQuestion-> !searchableQuestion.getId().equals(question.getId())
        ).toList());

        searchableQuizRepository.save(searchableQuiz);
    }
}

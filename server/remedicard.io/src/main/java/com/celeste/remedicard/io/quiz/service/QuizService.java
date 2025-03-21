package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionService questionService;

    public Quiz getById(Long quizId) {
        return quizRepository.findById(quizId).orElseThrow();
    }

    public Set<Quiz> getByUserId(Long userId) {
        return quizRepository.findByUsersId(userId);
    }

    public void create(Quiz quiz, User user) {
        quiz.getUsers().add(user);
        quizRepository.save(quiz);
    }

    public void delete(Long quizId) {
        quizRepository.deleteById(quizId);
        // are all the questions deleted
        // do all the users still have the quiz
    }

    public void deleteUserQuiz(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        quiz.getUsers().remove(user);
        quizRepository.save(quiz);
    }

    public void addQuestion(Long questionId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        Question question = questionService.getById(questionId);
        quiz.getQuestions().add(question);
        quizRepository.save(quiz);
    }

    public void deleteQuestion(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        Question question = questionService.getById(questionId);
        quiz.getQuestions().remove(question);
        quizRepository.save(quiz);
    }

//    public void update(Quiz quiz, Long quizId) {
//        Question questionToUpdate = quizRepository.findById(quizId).orElseThrow();
//        BeanUtils.copyProperties(quizId, questionToUpdate, "id");
//        quizRepository.save(questionToUpdate);
//    }
}

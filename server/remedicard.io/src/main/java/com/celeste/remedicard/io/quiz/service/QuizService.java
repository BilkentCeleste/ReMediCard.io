package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionService questionService;
    private final UserRepository userRepository;

    public Quiz getById(Long quizId) {
        return quizRepository.findById(quizId).orElseThrow();
    }

    public Set<Quiz> getByUserId(Long userId) {
        return quizRepository.findByUsersId(userId);
    }

    public void create(Quiz quiz, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        quiz.addUser(user);
        quizRepository.save(quiz);
    }

    @Transactional
    public void delete(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        quiz.removeAllUsers();
        quizRepository.deleteById(quizId);
    }

    public void addUserQuiz(Long quizId, Long userId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        quiz.addUser(user);
        quizRepository.save(quiz);
    }

    public void deleteUserQuiz(Long quizId, Long userId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        quiz.removeUser(user);
        quizRepository.save(quiz);
    }

    public void addQuestion(Long questionId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        Question question = questionService.getById(questionId);
        quiz.addQuestion(question);
        quizRepository.save(quiz);
    }

    public void removeQuestion(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        Question question = questionService.getById(questionId);
        quiz.removeQuestion(question);
        quizRepository.save(quiz);
    }

//    public void update(Quiz quiz, Long quizId) {
//        Question questionToUpdate = quizRepository.findById(quizId).orElseThrow();
//        BeanUtils.copyProperties(quizId, questionToUpdate, "id");
//        quizRepository.save(questionToUpdate);
//    }
}

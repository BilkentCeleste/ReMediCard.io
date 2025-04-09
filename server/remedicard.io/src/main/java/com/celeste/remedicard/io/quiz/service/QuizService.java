package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionService questionService;
    private final CurrentUserService currentUserService;

    public Quiz getById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with id: " + quizId));
    }

    public Set<Quiz> getByUserId(Long userId) {
        return quizRepository.findByUserId(userId);
    }

    public Set<Quiz> getByCurrentUserId() {
        Long currentUserId = currentUserService.getCurrentUser().getId();

        return quizRepository.findByUserId(currentUserId);
    }

    public Quiz create(Quiz quiz) {
        User user = currentUserService.getCurrentUser();

        quiz.addUser(user);

        quizRepository.save(quiz);
        return quiz;
    }

    @Transactional
    public void delete(Long quizId) {
        Quiz quiz = getById(quizId);

        quiz.removeUser();

        quizRepository.deleteById(quizId);
    }

    public void addUserQuiz(Long quizId) {
        Quiz originalQuiz = getById(quizId);
        User user = currentUserService.getCurrentUser();
        
        Quiz newQuiz = new Quiz(originalQuiz);
        newQuiz.addUser(user);
        
        quizRepository.save(newQuiz);
    }

    public void addQuestion(Long questionId, Long quizId) {
        Quiz quiz = getById(quizId);
        Question question = questionService.getById(questionId);

        quiz.addQuestion(question);

        quizRepository.save(quiz);
    }

    public void removeQuestion(Long questionId, Long quizId) {
        Quiz quiz = getById(quizId);
        Question question = questionService.getById(questionId);

        quiz.removeQuestion(question);

        quizRepository.save(quiz);
    }

//    public void update(Quiz quiz, Long quizId) {
//        Quiz quizToUpdate = quizRepository.findById(quizId).orElseThrow();
//        BeanUtils.copyProperties(quizId, quizToUpdate, "id");
//        quizRepository.save(quizToUpdate);
//    }
}

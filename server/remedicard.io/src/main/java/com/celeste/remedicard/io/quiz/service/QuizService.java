package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.auth.service.UserService;
import com.celeste.remedicard.io.autogeneration.dto.QuestionCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.QuizCreationTask;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import com.celeste.remedicard.io.search.service.SearchService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.celeste.remedicard.io.quiz.controller.dto.ShareQuizResponseDTO;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionService questionService;
    private final CurrentUserService currentUserService;
    private final UserService userService;
    private final SearchService searchService;

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
        searchService.saveSearchableQuiz(quiz);
        return quiz;
    }

    @Transactional
    public void delete(Long quizId) {
        Quiz quiz = getById(quizId);

        quiz.removeUser();

        searchService.deleteSearchableQuiz(quizId);
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
        searchService.addSearchableQuestion(quizId, question);
    }

    public void removeQuestion(Long questionId, Long quizId) {
        Quiz quiz = getById(quizId);
        Question question = questionService.getById(questionId);

        quiz.removeQuestion(question);

        quizRepository.save(quiz);
        searchService.removeSearchableQuestion(quizId, question);
    }


    @Transactional
    public void createQuiz(QuizCreationTask quizCreationTask) {
        User user = userService.getUserById(quizCreationTask.getUserId());

        Set<Question> questions = new HashSet<>();

        Quiz quiz = Quiz.builder()
                .name(quizCreationTask.getName())
                .popularity(0)
                .difficulty("")
                .user(null)
                .build();

        quiz.addUser(user);

        for(QuestionCreationTask questionCreationTask: quizCreationTask.getQuestions()){
            questions.add(Question.builder()
                    .quiz(quiz)
                    .description(questionCreationTask.getDescription())
                    .options(questionCreationTask.getOptions())
                    .answer(questionCreationTask.getAnswer().toUpperCase())
                    .build());
        }

        quiz.setQuestions(questions);

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(user.getRole().name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

        quizRepository.save(quiz);

        searchService.saveSearchableQuiz(quiz);
    }

    public ShareQuizResponseDTO generateShareToken(Long quizId) {
        Quiz quiz = getById(quizId);
        String shareToken = java.util.UUID.randomUUID().toString();
        quiz.setShareToken(shareToken);
        quizRepository.save(quiz);
        return new ShareQuizResponseDTO(shareToken);
    }

    public Quiz getByShareToken(String shareToken) {
        return quizRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with share token: " + shareToken));
    }

//    public void update(Quiz quiz, Long quizId) {
//        Quiz quizToUpdate = quizRepository.findById(quizId).orElseThrow();
//        BeanUtils.copyProperties(quizId, quizToUpdate, "id");
//        quizRepository.save(quizToUpdate);
//    }
}

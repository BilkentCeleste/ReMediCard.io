package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.autogeneration.dto.QuestionCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.QuizCreationTask;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
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


    @Transactional
    public void createQuiz(QuizCreationTask quizCreationTask) {
        User user = userRepository.findById(quizCreationTask.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        Set<Question> questions = new HashSet<>();

        Quiz quiz = Quiz.builder()
                .name(quizCreationTask.getName())
                .popularity(0)
                .difficulty("")
                .users(new HashSet<>())
                .build();

        quiz.addUser(user);

        for(QuestionCreationTask questionCreationTask: quizCreationTask.getQuestions()){
            questions.add(Question.builder()
                    .quiz(quiz)
                    .description(questionCreationTask.getDescription())
                    .options(questionCreationTask.getOptions())
                    .answer(questionCreationTask.getAnswer().toLowerCase())
                    .build());
        }

        quiz.setQuestions(questions);

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(user.getRole().name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

        quizRepository.save(quiz);
    }


//    public void update(Quiz quiz, Long quizId) {
//        Question questionToUpdate = quizRepository.findById(quizId).orElseThrow();
//        BeanUtils.copyProperties(quizId, questionToUpdate, "id");
//        quizRepository.save(questionToUpdate);
//    }
}

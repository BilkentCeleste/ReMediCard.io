package com.celeste.remedicard.io.quiz.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.auth.service.UserService;
import com.celeste.remedicard.io.autogeneration.dto.QuestionCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.QuizCreationTask;
import com.celeste.remedicard.io.quiz.controller.dto.QuizResponseWithoutQuestionsDTO;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.mapper.QuizzesResponseMapper;
import com.celeste.remedicard.io.quiz.repository.QuizRepository;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import com.celeste.remedicard.io.quizStats.mapper.QuizStatsResponseMapper;
import com.celeste.remedicard.io.quizStats.service.QuizStatsService;
import com.celeste.remedicard.io.search.entity.SearchableQuestion;
import com.celeste.remedicard.io.search.entity.SearchableQuiz;
import com.celeste.remedicard.io.search.repository.SearchableQuizRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final SearchableQuizRepository searchableQuizRepository;
    private final CurrentUserService currentUserService;
    private final UserService userService;
    private final QuizStatsService quizStatsService;

    @Value("${app.share-url-base}")
    private String shareUrlBase;

    public Quiz getById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with id: " + quizId));
    }

    public Set<Quiz> getByUserId(Long userId) {
        return quizRepository.findByUserIdOrderByIdAsc(userId);
    }

    public Set<Quiz> getByCurrentUserId() {
        Long currentUserId = currentUserService.getCurrentUser().getId();
        return quizRepository.findByUserIdOrderByIdAsc(currentUserId);
    }

    public Quiz create(Quiz quiz) {
        User user = currentUserService.getCurrentUser();
        quiz.addUser(user);
        quizRepository.save(quiz);
        saveSearchableQuiz(quiz);
        return quiz;
    }

    @Transactional
    public void delete(Long quizId) {
        Quiz quiz = getById(quizId);
        quiz.removeUser();
        deleteSearchableQuiz(quizId);
        quizRepository.deleteById(quizId);
    }

    public void addUserQuiz(Long quizId) {
        Quiz originalQuiz = getById(quizId);
        User user = currentUserService.getCurrentUser();

        Quiz newQuiz = new Quiz(originalQuiz);
        newQuiz.addUser(user);

        quizRepository.save(newQuiz);
    }

    public Integer handleQuestionAnswerIndexing (String answer) {
        return switch (answer) {
            case "A" -> 0;
            case "B" -> 1;
            case "C" -> 2;
            case "D" -> 3;
            case "E" -> 4;
            default -> throw new IllegalArgumentException("Invalid answer option: " + answer);
        };
    }

    @Transactional
    public void createQuiz(QuizCreationTask quizCreationTask) {
        User user = userService.getUserById(quizCreationTask.getUserId());

        List<Question> questions = new ArrayList<>();

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
                    .correctAnswerIndex(handleQuestionAnswerIndexing(questionCreationTask.getAnswer().toUpperCase()))
                    .build());
        }

        quiz.setQuestionCount(questions.size());
        quiz.setQuestions(questions);

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(user.getRole().name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

        quizRepository.save(quiz);
        saveSearchableQuiz(quiz);
    }

    public String generateShareToken(Long quizId) {
        Quiz quiz = getById(quizId);
        if (quiz.getShareToken() != null) {
            return shareUrlBase + "?sharedItem=quiz&shareToken=" + quiz.getShareToken();
        }
        String shareToken = java.util.UUID.randomUUID().toString();
        quiz.setShareToken(shareToken);
        quizRepository.save(quiz);
        return shareUrlBase + "?sharedItem=quiz&shareToken=" + shareToken;
    }

    public Quiz getByShareToken(String shareToken) {
        return quizRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found with share token: " + shareToken));
    }

    public Set<Quiz> findQuizzesByIds(Set<Long> ids) {
        return new HashSet<>(quizRepository.findAllById(ids));
    }

    public Set<QuizResponseWithoutQuestionsDTO> convertFromQuizToQuizResponseWithoutFlashcardsDTO(Set<Quiz> quizzes, Long userId){
        Set<QuizResponseWithoutQuestionsDTO> response = QuizzesResponseMapper.INSTANCE.toDTO(quizzes);
        response.forEach(quiz -> {
            QuizStats bestQuizStats = quizStatsService.getBestQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            QuizStats lastQuizStats = quizStatsService.getLastQuizStatsByQuizIdAndUserId(quiz.getId(), userId);
            quiz.setBestQuizStat(bestQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(bestQuizStats) : null);
            quiz.setLastQuizStat(lastQuizStats != null ? QuizStatsResponseMapper.INSTANCE.toDTO(lastQuizStats) : null);
        });

        return response;
    }

    public void saveSearchableQuiz(Quiz quiz){
        User user = currentUserService.getCurrentUser();

        SearchableQuiz searchableQuiz = SearchableQuiz.builder()
                .id(quiz.getId())
                .userId(user.getId())
                .name(quiz.getName())
                .questions(quiz.getQuestions() == null? new ArrayList<>() : quiz.getQuestions().stream().map(
                        question -> SearchableQuestion.builder()
                                .id(question.getId())
                                .description(question.getDescription())
                                .options(question.getOptions())
                                .build()
                ).collect(Collectors.toList()))
                .build();

        searchableQuizRepository.save(searchableQuiz);
    }

    public void deleteSearchableQuiz(Long id) {
        SearchableQuiz searchableQuiz = searchableQuizRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableQuizRepository.delete(searchableQuiz);
    }

    @Transactional
    public Quiz updateQuizName(Long quizId, String name) {
        Quiz quiz = getById(quizId);
        quiz.setName(name);
        quizRepository.save(quiz);
        saveSearchableQuiz(quiz);
        return quiz;
    }
}

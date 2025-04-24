package com.celeste.remedicard.io.common.config;

import com.celeste.remedicard.io.auth.entity.Role;
import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.service.DeckService;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.service.DeckStatsService;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.flashcard.service.FlashcardService;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.service.QuestionService;
import com.celeste.remedicard.io.quiz.service.QuizService;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import com.celeste.remedicard.io.quizStats.service.QuizStatsService;
import jakarta.transaction.Transactional;
import org.apache.commons.codec.language.bm.Lang;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Profile("db_reset")
public class DevDatabasePopulator implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final DeckService deckService;
    private final FlashcardService flashcardService;
    private final DeckStatsService deckStatsService;
    private final QuizService quizService;
    private final QuizStatsService quizStatsService;
    private final QuestionService questionService;

    public DevDatabasePopulator(PasswordEncoder passwordEncoder, UserRepository userRepository, CurrentUserService currentUserService, DeckService deckService, FlashcardService flashcardService, DeckStatsService deckStatsService, QuizService quizService, QuizStatsService quizStatsService, QuestionService questionService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.deckService = deckService;
        this.flashcardService = flashcardService;
        this.deckStatsService = deckStatsService;
        this.quizService = quizService;
        this.quizStatsService = quizStatsService;
        this.questionService = questionService;
    }


    @Override
    @Transactional
    public void run(String... args) throws IOException {

        // User
        User user = User.builder()
                .username("testUser")
                .email("testUser@test")
                .password(passwordEncoder.encode("testUser"))
                .role(Role.USER)
                .pushNotificationToken(null)
                .language(Language.ENGLISH)
                .build();

        // Deck
        Deck deck = Deck.builder()
                .name("Test Deck")
                .topic("Test topic")
                .difficulty("Test difficulty")
                .flashcardCount(0)
                .popularity(0)
                .build();

        // DeckStats
        DeckStats deckStats = DeckStats.builder()
                .successRate(50)
                .build();

        // Flashcards
        Flashcard flashcard1 = Flashcard.builder()
                .topic("Test topic")
                .type("Test type")
                .frequency(0.5)
                .frontSide(Side.builder()
                        .text("Test front side")
                        .build()
                )
                .backSide(Side.builder()
                        .text("Test back side")
                        .build()
                )
                .build();

        Flashcard flashcard2 = Flashcard.builder()
                .topic("Test topic2")
                .type("Test type2")
                .frequency(0.5)
                .frontSide(Side.builder()
                        .text("Test front side2")
                        .build()
                )
                .backSide(Side.builder()
                        .text("Test back side2")
                        .build()
                )
                .build();

        // Quiz
        Quiz quiz = Quiz.builder()
                .name("Test Quiz")
                .difficulty("Test difficulty")
                .popularity(0)
                .build();

        // QuizStats
        QuizStats quizStats = QuizStats.builder()
                .successRate(50)
                .build();

        // Questions
        Question question1 = Question.builder()
                .difficulty("Test difficulty")
                .description("Test description")
                .correctAnswerIndex(0)
                .options(List.of("Test option A", "Test option B", "Test option C", "Test option D", "Test option E"))
                .build();

        Question question2 = Question.builder()
                .difficulty("Test difficulty2")
                .description("Test description2")
                .correctAnswerIndex(1)
                .options(List.of("Test option A2", "Test option B2", "Test option C2", "Test option D2", "Test option E2"))
                .build();


        userRepository.save(user);
        currentUserService.setCurrentUser(user);
        deckService.create(deck);
        deckStatsService.create(deckStats, deck.getId());
        flashcardService.create(flashcard1, deck.getId(), null, null);
        flashcardService.create(flashcard2, deck.getId(), null, null);
        quizService.create(quiz);
        quizStatsService.create(quizStats, quiz.getId());
        questionService.create(question1, quiz);
        questionService.create(question2, quiz);
    }
}

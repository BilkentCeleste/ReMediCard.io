package com.celeste.remedicard.io.search.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.quiz.entity.Question;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.search.dto.DeckResultDTO;
import com.celeste.remedicard.io.search.dto.GeneralSearchResponseDTO;
import com.celeste.remedicard.io.search.dto.QuizResultDTO;
import com.celeste.remedicard.io.search.entity.SearchableDeck;
import com.celeste.remedicard.io.search.entity.SearchableFlashcard;
import com.celeste.remedicard.io.search.entity.SearchableQuestion;
import com.celeste.remedicard.io.search.entity.SearchableQuiz;
import com.celeste.remedicard.io.search.repository.SearchableDeckRepository;
import com.celeste.remedicard.io.search.repository.SearchableQuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SearchService {

    private final SearchableDeckRepository searchableDeckRepository;
    private final SearchableQuizRepository searchableQuizRepository;
    private final CurrentUserService currentUserService;

    public GeneralSearchResponseDTO search(String searchText){
        User user = currentUserService.getCurrentUser();

        List<SearchableDeck> searchableDecks = searchableDeckRepository.findSearchableDeckContaining(searchText, user.getId());
        List<SearchableQuiz> searchableQuizzes = searchableQuizRepository.findSearchableQuizContaining(searchText, user.getId());

        return GeneralSearchResponseDTO.builder()
                .decks(searchableDecks.stream().map(deck -> DeckResultDTO.builder().id(deck.getId()).name(deck.getName()).build()).toList())
                .quizzes(searchableQuizzes.stream().map(quiz -> QuizResultDTO.builder().id(quiz.getId()).name(quiz.getName()).build()).toList())
                .build();
    }

    public GeneralSearchResponseDTO searchDecks(String searchText){
        User user = currentUserService.getCurrentUser();

        List<SearchableDeck> searchableDecks = searchableDeckRepository.findSearchableDeckContaining(searchText, user.getId());

        return  GeneralSearchResponseDTO.builder()
                .decks(searchableDecks.stream().map(deck -> DeckResultDTO.builder().id(deck.getId()).name(deck.getName()).build()).toList())
                .build();
    }

    public GeneralSearchResponseDTO searchQuizzes(String searchText){
        User user = currentUserService.getCurrentUser();

        List<SearchableQuiz> searchableQuizzes = searchableQuizRepository.findSearchableQuizContaining(searchText, user.getId());

        return  GeneralSearchResponseDTO.builder()
                .quizzes(searchableQuizzes.stream().map(quiz -> QuizResultDTO.builder().id(quiz.getId()).name(quiz.getName()).build()).toList())
                .build();
    }

    public void saveSearchableDeck(Deck deck){
        User user = currentUserService.getCurrentUser();

        SearchableDeck searchableDeck = SearchableDeck.builder()
                .id(deck.getId())
                .userId(user.getId())
                .name(deck.getName())
                .flashcards(deck.getFlashcardSet() == null? new ArrayList<>() : deck.getFlashcardSet().stream().map(
                        flashcard -> SearchableFlashcard.builder()
                                .id(flashcard.getId())
                                .back(flashcard.getBackSide().getText())
                                .front(flashcard.getFrontSide().getText())
                                .build()
                ).collect(Collectors.toList()))
                .build();

        searchableDeckRepository.save(searchableDeck);
    }

    public void addSearchableFlashcard(Long id, Flashcard flashcard) {
        SearchableDeck searchableDeck = searchableDeckRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableDeck.getFlashcards().add(SearchableFlashcard.builder()
                .id(flashcard.getId())
                .back(flashcard.getBackSide().getText())
                .front(flashcard.getFrontSide().getText())
                .build());

        searchableDeckRepository.save(searchableDeck);
    }

    public void removeSearchableFlashcard(Long id, Flashcard flashcard) {
        SearchableDeck searchableDeck = searchableDeckRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableDeck.setFlashcards(searchableDeck.getFlashcards().stream().filter(
                searchableFlashcard -> !searchableFlashcard.getId().equals(flashcard.getId())
        ).toList());

        searchableDeckRepository.save(searchableDeck);
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

    public void deleteSearchableQuiz(Long id) {
        SearchableQuiz searchableQuiz = searchableQuizRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableQuizRepository.delete(searchableQuiz);
    }

    public void deleteSearchableDeck(Long id) {
        SearchableDeck searchableDeck = searchableDeckRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableDeckRepository.delete(searchableDeck);
    }
}

package com.celeste.remedicard.io.search.service;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.auth.service.UserService;
import com.celeste.remedicard.io.deck.controller.dto.DeckExploreResponseDTO;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.service.DeckService;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.quiz.controller.dto.QuizExploreResponseDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuizResponseWithoutQuestionsDTO;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.quiz.service.QuizService;
import com.celeste.remedicard.io.search.dto.DeckResultDTO;
import com.celeste.remedicard.io.search.dto.GeneralSearchResponseDTO;
import com.celeste.remedicard.io.search.dto.QuizResultDTO;
import com.celeste.remedicard.io.search.entity.SearchableDeck;
import com.celeste.remedicard.io.search.entity.SearchableFlashcard;
import com.celeste.remedicard.io.search.entity.SearchableQuiz;
import com.celeste.remedicard.io.search.repository.SearchableDeckRepository;
import com.celeste.remedicard.io.search.repository.SearchableQuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SearchService {

    private final SearchableDeckRepository searchableDeckRepository;
    private final SearchableQuizRepository searchableQuizRepository;
    private final DeckService deckService;
    private final QuizService quizService;
    private final CurrentUserService currentUserService;
    private final UserService userService;

    public GeneralSearchResponseDTO search(String searchText){
        Long userId = currentUserService.getCurrentUserId();

        List<SearchableDeck> searchableDecks = searchableDeckRepository.findSearchableDeckContaining(searchText, userId);
        List<SearchableQuiz> searchableQuizzes = searchableQuizRepository.findSearchableQuizContaining(searchText, userId);

        return GeneralSearchResponseDTO.builder()
                .decks(searchableDecks.stream().map(deck -> DeckResultDTO.builder().id(deck.getId()).name(deck.getName()).build()).toList())
                .quizzes(searchableQuizzes.stream().map(quiz -> QuizResultDTO.builder().id(quiz.getId()).name(quiz.getName()).build()).toList())
                .build();
    }

    public Set<DeckResponseWithoutFlashcardsDTO> searchDecks(String searchText){
        Long userId = currentUserService.getCurrentUserId();

        List<SearchableDeck> searchableDecks = searchableDeckRepository.findSearchableDeckContaining(searchText, userId);

        Set<Deck> decks = deckService.findDecksByIds(searchableDecks.stream().map(SearchableDeck::getId).collect(Collectors.toSet()));

        return  deckService.convertFromDeckToDeckResponseWithoutFlashcardsDTO(decks, userId);
    }

    public Set<QuizResponseWithoutQuestionsDTO> searchQuizzes(String searchText){
        Long userId = currentUserService.getCurrentUserId();

        List<SearchableQuiz> searchableQuizzes = searchableQuizRepository.findSearchableQuizContaining(searchText, userId);

        Set<Quiz> quizzes = quizService.findQuizzesByIds(searchableQuizzes.stream().map(SearchableQuiz::getId).collect(Collectors.toSet()));

        return  quizService.convertFromQuizToQuizResponseWithoutFlashcardsDTO(quizzes, userId);
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

    public List<DeckExploreResponseDTO> searchOthersDecks(String searchText){
        Long userId = currentUserService.getCurrentUserId();

        List<SearchableDeck> searchableDecks = searchableDeckRepository.findSearchableDeckContainingButNotOwnedBy(searchText, userId);
        List<Deck> decks = deckService.findDecksByIds(searchableDecks.stream().map(SearchableDeck::getId).collect(Collectors.toSet())).stream().filter(Deck::getIsPubliclyVisible).toList();

        return  deckService.convertFromDeckToDeckExploreResponseDTO(decks, userId);
    }

    public List<QuizExploreResponseDTO> searchOthersQuizzes(String searchText){
        Long userId = currentUserService.getCurrentUserId();

        List<SearchableQuiz> searchableQuizzes = searchableQuizRepository.findSearchableQuizContainingButNotOwnedBy(searchText, userId);

        List<Quiz> quizzes = quizService.findQuizzesByIds(searchableQuizzes.stream().map(SearchableQuiz::getId).collect(Collectors.toSet())).stream().filter(Quiz::getIsPubliclyVisible).toList();

        return  quizService.convertFromQuizToQuizExploreResponseDTO(quizzes, userId);
    }
}

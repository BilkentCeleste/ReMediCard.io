package com.celeste.remedicard.io.search.controller;

import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import com.celeste.remedicard.io.quiz.controller.dto.QuizResponseWithoutQuestionsDTO;
import com.celeste.remedicard.io.search.dto.GeneralSearchResponseDTO;
import com.celeste.remedicard.io.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public GeneralSearchResponseDTO searchDeckOrQuiz(@RequestParam("searchtext") String searchText) {
        return searchService.search(searchText);
    }

    @GetMapping("deck")
    public Set<DeckResponseWithoutFlashcardsDTO> searchDecks(@RequestParam("searchtext") String searchText) {
        return searchService.searchDecks(searchText);
    }

    @GetMapping("quiz")
    public Set<QuizResponseWithoutQuestionsDTO> searchQuizzes(@RequestParam("searchtext") String searchText) {
        return searchService.searchQuizzes(searchText);
    }
}

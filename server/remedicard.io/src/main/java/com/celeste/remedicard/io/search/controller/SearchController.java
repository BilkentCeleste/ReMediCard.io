package com.celeste.remedicard.io.search.controller;

import com.celeste.remedicard.io.search.dto.GeneralSearchResponseDTO;
import com.celeste.remedicard.io.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public GeneralSearchResponseDTO searchDeckOrQuiz(@RequestParam("searchtext") String searchText) {
        return searchService.search(searchText);
    }

    @GetMapping("deck")
    public GeneralSearchResponseDTO searchDecks(@RequestParam("searchtext") String searchText) {
        return searchService.searchDecks(searchText);
    }

    @GetMapping("quiz/")
    public GeneralSearchResponseDTO searchQuizzes(@RequestParam("searchtext") String searchText) {
        return searchService.searchQuizzes(searchText);
    }
}

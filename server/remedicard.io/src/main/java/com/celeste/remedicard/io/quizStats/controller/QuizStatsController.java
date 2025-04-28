package com.celeste.remedicard.io.quizStats.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsCreateRequestDTO;
import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsResponseDTO;
import com.celeste.remedicard.io.quizStats.controller.dto.QuizStatsResponseWithQuizNameDTO;
import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import com.celeste.remedicard.io.quizStats.mapper.QuizStatsCreateRequestMapper;
import com.celeste.remedicard.io.quizStats.mapper.QuizStatsResponseMapper;
import com.celeste.remedicard.io.quizStats.service.QuizStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/quizStats")
@RequiredArgsConstructor
public class QuizStatsController {

    private final QuizStatsService quizStatsService;
    private final CurrentUserService currentUserService;

    @PostMapping("/create")
    public ResponseEntity<Void> create(@RequestBody QuizStatsCreateRequestDTO dto) {
        QuizStats quizStats = QuizStatsCreateRequestMapper.INSTANCE.toEntity(dto);
        quizStatsService.create(quizStats, dto.getQuizId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getQuizStats/{quizId}")
    public Set<QuizStatsResponseDTO> getQuizStats(@PathVariable Long quizId) {
        Long userId = currentUserService.getCurrentUserId();
        Set<QuizStats> quizStats = quizStatsService.getQuizStatsByQuizIdAndUserId(quizId, userId);
        return QuizStatsResponseMapper.INSTANCE.toDTO(quizStats);
    }

    @GetMapping("/getRandomQuizStatsByCurrentUser")
    public QuizStatsResponseWithQuizNameDTO getRandomQuizStatsByCurrentUser() {
        return quizStatsService.getRandomQuizStatsByCurrentUser();
    }
}

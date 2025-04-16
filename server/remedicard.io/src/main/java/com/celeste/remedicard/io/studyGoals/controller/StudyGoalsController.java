package com.celeste.remedicard.io.studyGoals.controller;

import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsCreateRequestDTO;
import com.celeste.remedicard.io.studyGoals.controller.dto.StudyGoalsResponseDTO;
import com.celeste.remedicard.io.studyGoals.entity.StudyGoals;
import com.celeste.remedicard.io.studyGoals.mapper.StudyGoalsCreateRequestMapper;
import com.celeste.remedicard.io.studyGoals.mapper.StudyGoalsResponseMapper;
import com.celeste.remedicard.io.studyGoals.service.StudyGoalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/studyGoals")
@RequiredArgsConstructor
public class StudyGoalsController {

    private final StudyGoalsService studyGoalsService;
    private final CurrentUserService currentUserService;

    @PostMapping("/create")
    public ResponseEntity<Void> create(@RequestBody StudyGoalsCreateRequestDTO dto) {
        StudyGoals studyGoals = StudyGoalsCreateRequestMapper.INSTANCE.toEntity(dto);
        studyGoalsService.create(studyGoals, dto.getDeckId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{studyGoalsId}")
    public ResponseEntity<Void> delete(@PathVariable Long studyGoalsId) {
        studyGoalsService.delete(studyGoalsId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{studyGoalsId}")
    public ResponseEntity<Void> update(@RequestBody StudyGoalsCreateRequestDTO dto, @PathVariable Long studyGoalsId) {
        StudyGoals studyGoals = StudyGoalsCreateRequestMapper.INSTANCE.toEntity(dto);
        studyGoalsService.update(studyGoals, studyGoalsId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getByCurrentUser")
    public Set<StudyGoalsResponseDTO> getByCurrentUser() {
        Long currentUserId = currentUserService.getCurrentUserId();
        Set<StudyGoals> studyGoals = studyGoalsService.getStudyGoalsByUserId(currentUserId);
        return StudyGoalsResponseMapper.INSTANCE.toDTO(studyGoals);
    }

    @GetMapping("/getByCurrentUserAndDeck/{deckId}")
    public StudyGoalsResponseDTO getByCurrentUserAndDeck(@PathVariable Long deckId) {
        Long currentUserId = currentUserService.getCurrentUserId();
        StudyGoals studyGoals = studyGoalsService.getStudyGoalsByUserIdAndDeckId(currentUserId, deckId);
        return StudyGoalsResponseMapper.INSTANCE.toDTO(studyGoals);
    }

}

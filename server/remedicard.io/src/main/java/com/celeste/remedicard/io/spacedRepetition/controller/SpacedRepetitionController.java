package com.celeste.remedicard.io.spacedRepetition.controller;

import com.celeste.remedicard.io.spacedRepetition.service.SpacedRepetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/spaced-repetition")
@RequiredArgsConstructor
public class SpacedRepetitionController {

    private final SpacedRepetitionService spacedRepetitionService;
}

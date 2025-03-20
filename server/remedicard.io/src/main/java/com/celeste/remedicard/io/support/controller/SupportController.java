package com.celeste.remedicard.io.support.controller;

import com.celeste.remedicard.io.support.controller.dto.FeedbackRequest;
import com.celeste.remedicard.io.support.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping("feedback")
    public void create(@RequestBody FeedbackRequest feedbackRequest) {
        supportService.createFeedback(feedbackRequest);
    }

}

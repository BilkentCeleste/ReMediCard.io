package com.celeste.remedicard.io.support.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.auth.service.EmailService;
import com.celeste.remedicard.io.support.controller.dto.FeedbackRequest;
import com.celeste.remedicard.io.support.entity.Feedback;
import com.celeste.remedicard.io.support.repository.FeedbackRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SupportService {

    private final EmailService emailService;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public void createFeedback(FeedbackRequest feedbackRequest){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        user = userRepository.findByUsername(user.getUsername()).get();

        Feedback feedback = Feedback.builder()
                .subject(feedbackRequest.getSubject())
                .content(feedbackRequest.getContent())
                .user(user)
                .build();

        emailService.sendContactUsEmail(user.getUsername(), user.getEmail(),
                feedbackRequest.getSubject(),
                feedbackRequest.getContent());

        feedbackRepository.save(feedback);
    }
}

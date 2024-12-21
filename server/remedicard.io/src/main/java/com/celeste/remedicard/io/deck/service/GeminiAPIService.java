package com.celeste.remedicard.io.deck.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiAPIService {

    @Value("${gemini.url}")
    private String url;

    @Value("${gemini.key}")
    private String key;

    private final RestTemplate restTemplate;

    public GeminiAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateFlashCardTexts(String text) {

        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}", "Generate flashcards out of the following text, list each flashcard in squared brackets and split back and front pairs of each flashcard with triple slash characters:" + text);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url + "?key=" + key, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to generate content, status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            // Handle any errors
            e.printStackTrace();
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}

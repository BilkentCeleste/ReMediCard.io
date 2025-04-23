package com.celeste.remedicard.io.notification.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.autogeneration.config.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Locale;

@RequiredArgsConstructor
@Service
public class NotificationService {

    @Value("${app.expo-push-url}")
    private String EXPO_PUSH_URL;

    private final RestTemplate restTemplate;
    private final CurrentUserService currentUserService;
    private final MessageSource messageSource;

    public void sendNotification(String notificationTitle, String notificationMessage, String[] args, String pushNotificationToken) {

        User user = currentUserService.getCurrentUser();
        Locale locale = new Locale(user.getLanguage().equals(Language.ENGLISH) ? "en": "tr");

        String title = messageSource.getMessage(notificationTitle, args, locale);
        String message = messageSource.getMessage(notificationMessage, args, locale);

        if(pushNotificationToken == null || pushNotificationToken.isEmpty()) {
            return;
        }

        try {

            String requestBody = String.format(
                    """
                    {
                        "to": "%s",
                        "sound": "default",
                        "title": "%s",
                        "body": "%s",
                        "data": {}
                    }
                    """,
                    pushNotificationToken,
                    title,
                    escapeJson(message)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String response = restTemplate.postForObject(EXPO_PUSH_URL, entity, String.class);
            //System.out.println("Expo push response: " + response);


        } catch (Exception e) {

            System.err.println("Failed to send notification: " + e.getMessage());
            throw new RuntimeException("Failed to send notification", e);
        }


    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"")

                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
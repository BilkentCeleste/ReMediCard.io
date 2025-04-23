package com.celeste.remedicard.io.auth.controller.dto;


import com.celeste.remedicard.io.autogeneration.config.Language;
import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private String email;
    private String username;
    private String pushNotificationToken;
    private Language language;
}

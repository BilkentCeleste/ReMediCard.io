package com.celeste.remedicard.io.auth.controller.dto;


import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private String email;
    private String username;
}

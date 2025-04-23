package com.celeste.remedicard.io.auth.controller.dto;

import com.celeste.remedicard.io.auth.entity.Role;
import com.celeste.remedicard.io.autogeneration.config.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String username;
    private String email;
    private String password;
    private Role role;
    private String pushNotificationToken;
    private Language language;
}

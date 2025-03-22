package com.celeste.remedicard.io.auth.controller.dto;

import com.celeste.remedicard.io.auth.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {

    String email;
    String code;
    String password;
}
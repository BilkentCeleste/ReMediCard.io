package com.celeste.remedicard.io.auth.controller.dto;

import lombok.Data;

@Data
public class AccountDeletionRequest {

    private String password;
    private String description;
}

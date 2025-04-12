package com.celeste.remedicard.io.auth.controller.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AccountProfileDTO {

    private String username;
    private String email;
}

package com.celeste.remedicard.io.auth.controller;

import com.celeste.remedicard.io.auth.controller.dto.AuthRequest;
import com.celeste.remedicard.io.auth.controller.dto.AuthResponse;
import com.celeste.remedicard.io.auth.controller.dto.RegisterRequest;
import com.celeste.remedicard.io.auth.controller.dto.ResetPasswordRequest;
import com.celeste.remedicard.io.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("login")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("forgot_password")
    public void generateResetPasswordCode(
            @RequestBody ResetPasswordRequest request
    ) {
        authService.sendForgotPasswordResetCode(request);
    }

    @PostMapping("reset_password")
    public ResponseEntity<AuthResponse> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("verify_reset_passwordcode")
    public ResponseEntity<AuthResponse> verifyResetPasswordCode(
            @RequestBody ResetPasswordRequest request
    ) {
        return ResponseEntity.ok(authService.verifyResetCode(request));
    }

    @Secured("ROLE_USER")
    @GetMapping("hello")
    public String hello() {
        return "Hello";
    }


}

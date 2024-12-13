package com.celeste.remedicard.io.controller;

import com.celeste.remedicard.io.dto.AuthRequest;
import com.celeste.remedicard.io.dto.AuthResponse;
import com.celeste.remedicard.io.dto.RegisterRequest;
import com.celeste.remedicard.io.service.AuthService;
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

    @Secured("ROLE_USER")
    @GetMapping("hello")
    public String hello() {
        return "Hello";
    }


}

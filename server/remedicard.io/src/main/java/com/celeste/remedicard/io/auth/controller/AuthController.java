package com.celeste.remedicard.io.auth.controller;

import com.celeste.remedicard.io.auth.controller.dto.*;
import com.celeste.remedicard.io.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

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

    @PostMapping("login_google")
    public ResponseEntity<AuthResponse> authenticateWithGoogle(
            @RequestBody GoogleAuthRequest request
    ) throws Exception {
        return ResponseEntity.ok(authService.authenticateWithGoogle(request));
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

    @PostMapping("initiate_delete_account")
    public ResponseEntity<Void> initiateAccountDeletion(@RequestBody AccountDeletionRequest accountDeletionRequest){
        authService.initiateDeleteAccount(accountDeletionRequest);

        return ResponseEntity.ok().build();
    }

    @GetMapping("confirm_delete_account")
    public RedirectView confirmAccountDeletion(@RequestParam String token){
        authService.completeDeleteAccount(token);

        return new RedirectView("/deletion-success.html");
    }

    @GetMapping("get_current_user_profile")
    public ResponseEntity<AccountProfileDTO> getProfileInfo(){

        return ResponseEntity.ok(authService.getCurrentUserProfile());
    }

}

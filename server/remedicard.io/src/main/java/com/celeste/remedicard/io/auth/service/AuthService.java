package com.celeste.remedicard.io.auth.service;

import com.celeste.remedicard.io.auth.controller.dto.AuthRequest;
import com.celeste.remedicard.io.auth.controller.dto.AuthResponse;
import com.celeste.remedicard.io.auth.controller.dto.RegisterRequest;
import com.celeste.remedicard.io.auth.controller.dto.ResetPasswordRequest;
import com.celeste.remedicard.io.auth.entity.Role;
import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Random;


@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        //var refreshToken = jwtService.generateRefreshToken(user);
        //saveUserToken(savedUser, jwtToken);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                //.refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                //.refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public void sendForgotPasswordResetCode(ResetPasswordRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if(user == null){
            return;
        }

        Random random = new SecureRandom();
        String resetToken = String.format("%06d", random.nextInt(1000000));
        Date expiryDate = Date.from(Instant.now().plus(60, ChronoUnit.MINUTES));

        user.setResetCode(resetToken);
        user.setResetCodeExpiry(expiryDate);

        userRepository.save(user);

        emailService.sendResetPasswordEmail(request.getEmail(), resetToken);
    }

    public AuthResponse resetPassword(ResetPasswordRequest resetPasswordRequest){

        if(resetPasswordRequest.getPassword() == null){
            throw new IllegalArgumentException();
        }

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(passwordEncoder.matches(resetPasswordRequest.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("New password must be different than the last 3 passwords.");
        }

        if(user.getPreviousPassword() != null && passwordEncoder.matches(resetPasswordRequest.getPassword(), user.getPreviousPassword())){
            throw new IllegalArgumentException("New password must be different than the last 3 passwords.");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse verifyResetCode(ResetPasswordRequest resetPasswordRequest){

        if(resetPasswordRequest.getEmail() == null || resetPasswordRequest.getCode() == null){
            throw new IllegalArgumentException();
        }
        User user = userRepository.findByEmail(resetPasswordRequest.getEmail()).orElseThrow(NoSuchElementException::new);

        if(user.getResetCode().equals(resetPasswordRequest.getCode()) && user.getResetCodeExpiry().after(new Date())){

            String jwtToken = jwtService.generateToken(user);

            return AuthResponse.builder()
                    .accessToken(jwtToken)
                    .role(user.getRole())
                    .build();
        }

        throw new IllegalArgumentException();
    }

}

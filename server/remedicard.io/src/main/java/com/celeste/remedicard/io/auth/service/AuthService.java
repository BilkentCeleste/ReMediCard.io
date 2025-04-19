package com.celeste.remedicard.io.auth.service;

import com.celeste.remedicard.io.auth.controller.dto.*;
import com.celeste.remedicard.io.auth.entity.Role;
import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;


@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final CurrentUserService currentUserService;
    private final GoogleVerifierService googleVerifierService;

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

    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) throws Exception {

        if(request.getIdToken() == null){
            throw new IllegalArgumentException();
        }

        googleVerifierService.verify(request.getIdToken());

        String username = request.getEmail().substring(0, request.getEmail().indexOf("@"));
        User user = userRepository.findByUsername(username).orElse(null);

        if(user == null){
            user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(username)) //TODO remove in production
                    .role(Role.USER)
                    .build();

            userRepository.save(user);
        }

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

        User user = currentUserService.getCurrentUser();

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

    public void initiateDeleteAccount(AccountDeletionRequest accountDeletionRequest){
        User user = currentUserService.getCurrentUser();

        if(!passwordEncoder.matches(accountDeletionRequest.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Wrong password");
        }

        String jwtToken = jwtService.generateToken(user).substring(7);

        emailService.sendAccountDeletionMail(user.getEmail(), jwtToken);
    }

    @Transactional
    public void completeDeleteAccount(String token){
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElse(null);

        if(user == null){
            return;
        }

        if(!jwtService.isTokenValid(token, user)){
            throw new IllegalArgumentException();
        }

        user.getFeedbacks().clear();
        user.getUsageStats().clear();
        user.getStudyStats().clear();
        user.getDecks().clear();
        user.getUsageStats().clear();

//        user.getQuizzes().forEach(quiz -> {
//            quiz.getQuestions().clear();
//            quiz.setUser(null);
//        });

        user.getQuizzes().clear();

//        Set<Quiz> quizzes = user.getQuizzes();
//        quizzes.forEach(Quiz::removeUser);
//        quizRepository.saveAll(quizzes);

        //user.getQuizzes().clear();

        userRepository.save(user);
        userRepository.delete(user);
    }

    public AccountProfileDTO getCurrentUserProfile() {
        User user = currentUserService.getCurrentUser();

        return AccountProfileDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}

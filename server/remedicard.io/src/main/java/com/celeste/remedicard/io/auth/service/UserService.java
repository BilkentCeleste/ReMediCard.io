package com.celeste.remedicard.io.auth.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

        private final UserRepository userRepository;

        public User getUserById(Long userId) {
            return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        }

        public User getUserByUsername(String username) {
            return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        }

        public User getUserByEmail(String email) {
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
}

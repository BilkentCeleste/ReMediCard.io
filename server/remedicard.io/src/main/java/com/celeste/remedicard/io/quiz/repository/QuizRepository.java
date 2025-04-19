package com.celeste.remedicard.io.quiz.repository;

import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Set<Quiz> findByUserId(Long userId);
    
    Optional<Quiz> findByShareToken(String shareToken);
}

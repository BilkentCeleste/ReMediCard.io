package com.celeste.remedicard.io.quiz.repository;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Set<Quiz> findByUserId(Long userId);
    Set<Quiz> findByUserIdOrderByIdAsc(Long userId);
    Optional<Quiz> findByShareToken(String shareToken);

    List<Quiz> findAllByIsPubliclyVisibleAndUserNotOrderByLikeCountDesc(Boolean isPubliclyVisible, User user);
    List<Quiz> findAllByIsPubliclyVisibleAndUserNotOrderByCreatedDateDesc(Boolean isPubliclyVisible, User user);
    List<Quiz> findAllByIsPubliclyVisibleAndUserNot(Boolean isPubliclyVisible, User user);
}

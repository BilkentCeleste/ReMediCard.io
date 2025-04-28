package com.celeste.remedicard.io.quizStats.repository;

import com.celeste.remedicard.io.quizStats.entity.QuizStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface QuizStatsRepository extends JpaRepository<QuizStats, Long> {
    Optional<Set<QuizStats>> findByQuizIdAndUserId(Long quizId, Long userId);

    @Query("SELECT ds FROM QuizStats ds WHERE ds.quiz.id = :quizId AND ds.user.id = :userId ORDER BY ds.successRate DESC LIMIT 1")
    Optional<QuizStats> findBestByQuizIdAndUserId(Long quizId, Long userId);

    @Query("SELECT ds FROM QuizStats ds WHERE ds.quiz.id = :quizId AND ds.user.id = :userId ORDER BY ds.accessDate DESC LIMIT 1")
    Optional<QuizStats> findLastByQuizIdAndUserId(Long quizId, Long userId);

    @Query("""
        SELECT ds FROM QuizStats ds
        WHERE ds.user.id = :userId
        AND ds.quiz.id = (
            SELECT ds2.quiz.id FROM QuizStats ds2
            WHERE ds2.user.id = :userId
            GROUP BY ds2.quiz.id
            ORDER BY RANDOM()
            LIMIT 1
        )
        ORDER BY ds.accessDate DESC
        LIMIT 1
    """)
    Optional<QuizStats> getRandomByUserId(Long userId);
}

package com.celeste.remedicard.io.auth.repository;

import com.celeste.remedicard.io.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsUserByEmail(String email);
    boolean existsUserByUsername(String username);
}

package com.celeste.remedicard.io.flashcard.repository;

import com.celeste.remedicard.io.flashcard.entity.Side;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SideRepository extends JpaRepository<Side, Long> {
}

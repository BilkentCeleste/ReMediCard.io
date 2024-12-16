package com.celeste.remedicard.io.flashcard.repository;

import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

}

package com.celeste.remedicard.io.deck.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.repository.UserRepository;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@RequiredArgsConstructor
public class DeckService {

    private final GeminiAPIService geminiAPIService;
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    public void create(Deck deck, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        deck.setUser(user);
        deckRepository.save(deck);
    }

    public Deck getDeckByDeckId(Long deckId) {
        return deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
    }

    public Set<Deck> getDeckByUserId(Long userId) {
        return deckRepository.findAllByUserId(userId);
    }

    public void removeDeck(Long deckId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));

        if(!deck.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException();
        }

        deckRepository.delete(deck);
    }

    public void generateDeck(MultipartFile file) {

        String text = extractTextFromPDF(file);
        String generatedText = geminiAPIService.generateFlashCardTexts(text);

        String fileName = file.getOriginalFilename();

        String regex = "\\[(.*?)\\]";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(generatedText);

        List<String> questionAnswerPairs = new ArrayList<>();

        while (matcher.find()) {
            questionAnswerPairs.add(matcher.group(1));
        }

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Deck deck = Deck.builder()
                .name("Generated_" + fileName)
                .topic("generated_" + fileName)
                .difficulty("Normal")
                .user(user)
                .popularity(3)
                .build();

        //deck = deckRepository.save(deck);

        //TODO CHECK ATTRIBUTES
        Set<Flashcard> flashcards = new HashSet<>();

        for (String pair : questionAnswerPairs) {
            String[] parts = pair.split(" /// ");

            if (parts.length != 2){
                continue;
            }

            Side frontSide = Side.builder()
                    .text(parts[0])
                    .build();

            Side backSide = Side.builder()
                    .text(parts[1])
                    .build();

            Flashcard flashcard = Flashcard.builder()
                    .type("flashcard")
                    .deck(deck)
                    .topic("")
                    .frequency(0.5)
                    .frontSide(frontSide)
                    .backSide(backSide)
                    .build();

            flashcards.add(flashcard);
        }

        deck.setFlashcardSet(flashcards);

        deckRepository.save(deck);
    }

    public String extractTextFromPDF(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            if (!document.isEncrypted()) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            } else {
                throw new IllegalArgumentException("The PDF file is encrypted and cannot be processed.");
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading the PDF file: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error occurred while processing the PDF: " + e.getMessage(), e);
        }
    }

}

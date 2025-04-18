package com.celeste.remedicard.io.deck.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.auth.service.UserService;
import com.celeste.remedicard.io.autogeneration.dto.DeckCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.FlashcardCreationTask;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.entity.DeckShareLink;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.deck.repository.DeckShareLinkRepository;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.search.service.SearchService;
import com.celeste.remedicard.io.spacedrepetition.service.SpacedRepetitionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Value;
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
    private final CurrentUserService currentUserService;
    private final DeckShareLinkRepository shareLinkRepository;
    private final UserService userService;
    private final SpacedRepetitionService spacedRepetitionService;
    private final SearchService searchService;

    @Value("${app.share-link-base-url}")
    private String shareLinkBaseUrl;

    public Deck create(Deck deck) {
        User user = currentUserService.getCurrentUser();
        deck.setUser(user);
        deckRepository.save(deck);
        searchService.saveSearchableDeck(deck);
        return deck;
    }

    public Deck getDeckByDeckId(Long deckId) {
        return deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
    }

    public Set<Deck> getDeckByUserId(Long userId) {
        return deckRepository.findAllByUserId(userId);
    }

    public Set<Deck> getDeckByCurrentUser() {
        Long userId = currentUserService.getCurrentUserId();

        return deckRepository.findAllByUserId(userId);
    }

    public void removeDeck(Long deckId) {
        Long userId = currentUserService.getCurrentUserId();

        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));

        if(!deck.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException();
        }

        deckRepository.delete(deck);
        searchService.deleteSearchableDeck(deckId);
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

        User user = currentUserService.getCurrentUser();

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

    public String createShareLink(Long deckId) {
        User currentUser = currentUserService.getCurrentUser();
        Deck deck = getDeckByDeckId(deckId);

        if (!deck.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Only deck owner can create share links");
        }

        DeckShareLink shareLink = deck.createShareLink();
        deckRepository.save(deck);

        return shareLinkBaseUrl + shareLink.getShareToken();
    }

    public Deck getSharedDeck(String shareToken) {
        DeckShareLink shareLink = shareLinkRepository.findByShareToken(shareToken);

        if (!shareLink.isActive()) {
            throw new IllegalArgumentException("Share link is expired");
        }

        return shareLink.getDeck();
    }

//    public Deck copySharedDeck(String shareToken) {
//
//    }

    @Transactional
    public void createDeck(DeckCreationTask deckCreationTask){

        User user = userService.getUserById(deckCreationTask.getUserId());

        Deck deck = Deck.builder()
                .name("Generated_" + deckCreationTask.getName())
                .topic(deckCreationTask.getName())
                .difficulty("Normal")
                .user(user)
                .popularity(0)
                .build();

        Set<Flashcard> flashcards = new HashSet<>();

        for (FlashcardCreationTask flashcardCreationTask : deckCreationTask.getFlashcards()) {

            Side frontSide = Side.builder()
                    .text(flashcardCreationTask.getFront())
                    .build();

            Side backSide = Side.builder()
                    .text(flashcardCreationTask.getBack())
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

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(user.getRole().name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

        deckRepository.save(deck);

        for(Flashcard flashcard: flashcards){
            spacedRepetitionService.create(user, flashcard);
        }

        searchService.saveSearchableDeck(deck);
    }

}

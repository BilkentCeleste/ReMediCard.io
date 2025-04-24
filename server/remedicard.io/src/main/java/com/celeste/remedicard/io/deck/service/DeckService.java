package com.celeste.remedicard.io.deck.service;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.auth.service.CurrentUserService;
import com.celeste.remedicard.io.auth.service.UserService;
import com.celeste.remedicard.io.autogeneration.dto.DeckCreationTask;
import com.celeste.remedicard.io.autogeneration.dto.FlashcardCreationTask;
import com.celeste.remedicard.io.cloud.service.S3Service;
import com.celeste.remedicard.io.deck.controller.dto.DeckResponseWithoutFlashcardsDTO;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.deck.mapper.DeckResponseWithoutFlashcardsMapper;
import com.celeste.remedicard.io.deck.repository.DeckRepository;
import com.celeste.remedicard.io.deckStats.entity.DeckStats;
import com.celeste.remedicard.io.deckStats.mapper.DeckStatsResponseMapper;
import com.celeste.remedicard.io.deckStats.service.DeckStatsService;
import com.celeste.remedicard.io.flashcard.entity.Flashcard;
import com.celeste.remedicard.io.flashcard.entity.Side;
import com.celeste.remedicard.io.flashcard.service.SideService;
import com.celeste.remedicard.io.search.entity.SearchableDeck;
import com.celeste.remedicard.io.search.entity.SearchableFlashcard;
import com.celeste.remedicard.io.search.repository.SearchableDeckRepository;
import com.celeste.remedicard.io.spacedrepetition.service.SpacedRepetitionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeckService {

    private final GeminiAPIService geminiAPIService;
    private final DeckRepository deckRepository;
    private final SearchableDeckRepository searchableDeckRepository;
    private final CurrentUserService currentUserService;
    private final UserService userService;
    private final SpacedRepetitionService spacedRepetitionService;
    private final DeckStatsService deckStatsService;
    private final S3Service s3Service;
    private final SideService sideService;

    @Value("${app.share-url-base}")
    private String shareUrlBase;

    public Deck create(Deck deck) {
        User user = currentUserService.getCurrentUser();
        deck.setUser(user);
        deckRepository.save(deck);
        saveSearchableDeck(deck);
        return deck;
    }

    public Deck getDeckByDeckId(Long deckId) {
        return deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));
    }

    public Set<Deck> getDeckByUserId(Long userId) {
        return deckRepository.findAllByUserIdOrderByIdAsc(userId);
    }

    public Set<Deck> getDeckByCurrentUser() {
        Long userId = currentUserService.getCurrentUserId();

        return deckRepository.findAllByUserIdOrderByIdAsc(userId);
    }

    public Set<Deck> findDecksByIds(Set<Long> ids){
        return new HashSet<>(deckRepository.findAllById(ids));
    }

    public void removeDeck(Long deckId) {
        Long userId = currentUserService.getCurrentUserId();

        Deck deck = deckRepository.findById(deckId).orElseThrow(() -> new RuntimeException("Deck not found"));

        if(!deck.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException();
        }

        // delete images from s3
        deck.getFlashcardSet().forEach(flashcard -> {
            String frontImageUrl = flashcard.getFrontSide().getImageURL();
            String backImageUrl = flashcard.getBackSide().getImageURL();
            if(frontImageUrl != null) {
                s3Service.deleteFile(frontImageUrl);
            }
            if(backImageUrl != null) {
                s3Service.deleteFile(backImageUrl);
            }
        });

        deckRepository.delete(deck);
        deleteSearchableDeck(deckId);
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
        List<Flashcard> flashcards = new ArrayList<>();

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

        List<Flashcard> flashcards = new ArrayList<>();

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

        saveSearchableDeck(deck);
    }

    public void addUserDeck(Long deckId) {
        Deck originalDeck = getDeckByDeckId(deckId);
        User user = currentUserService.getCurrentUser();

        Deck newDeck = new Deck(originalDeck);
        newDeck.addUser(user);

        deckRepository.save(newDeck);
        saveSearchableDeck(newDeck);

        newDeck.getFlashcardSet().forEach(flashcard -> {
            spacedRepetitionService.create(user, flashcard);
            sideService.copySideImage(flashcard.getFrontSide());
            sideService.copySideImage(flashcard.getBackSide());
        });
    }

    public String generateShareToken(Long deckId) {
        Deck deck = getDeckByDeckId(deckId);
        if (deck.getShareToken() != null) {
            return shareUrlBase + "?sharedItem=deck&shareToken=" + deck.getShareToken();
        }
        String shareToken = java.util.UUID.randomUUID().toString();
        deck.setShareToken(shareToken);
        deckRepository.save(deck);
        return shareUrlBase + "?sharedItem=deck&shareToken=" + shareToken;
    }

    public Deck getByShareToken(String shareToken) {
        return deckRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new EntityNotFoundException("Deck not found with share token: " + shareToken));
    }

    public Set<DeckResponseWithoutFlashcardsDTO> convertFromDeckToDeckResponseWithoutFlashcardsDTO(Set<Deck> decks, Long userId){
        Set<DeckResponseWithoutFlashcardsDTO> response = DeckResponseWithoutFlashcardsMapper.INSTANCE.toDTO(decks);
        response.forEach(deck -> {
            DeckStats bestDeckStats = deckStatsService.getBestDeckStatsByDeckIdAndUserId(deck.getId(), userId);
            DeckStats lastDeckStats = deckStatsService.getLastDeckStatsByDeckIdAndUserId(deck.getId(), userId);
            deck.setBestDeckStat(bestDeckStats != null ? DeckStatsResponseMapper.INSTANCE.toDTO(bestDeckStats) : null);
            deck.setLastDeckStat(lastDeckStats != null ? DeckStatsResponseMapper.INSTANCE.toDTO(lastDeckStats) : null);
        });

        return response;
    }


    public void saveSearchableDeck(Deck deck){
        User user = currentUserService.getCurrentUser();

        SearchableDeck searchableDeck = SearchableDeck.builder()
                .id(deck.getId())
                .userId(user.getId())
                .name(deck.getName())
                .flashcards(deck.getFlashcardSet() == null? new ArrayList<>() : deck.getFlashcardSet().stream().map(
                        flashcard -> SearchableFlashcard.builder()
                                .id(flashcard.getId())
                                .back(flashcard.getBackSide().getText())
                                .front(flashcard.getFrontSide().getText())
                                .build()
                ).collect(Collectors.toList()))
                .build();

        searchableDeckRepository.save(searchableDeck);
    }

    public void deleteSearchableDeck(Long id) {
        SearchableDeck searchableDeck = searchableDeckRepository.findById(id).orElseThrow(
                NoSuchElementException::new
        );

        searchableDeckRepository.delete(searchableDeck);
    }

    @Transactional
    public Deck updateDeckName(Long deckId, String name) {
        Deck deck = getDeckByDeckId(deckId);
        deck.setName(name);
        deckRepository.save(deck);
        saveSearchableDeck(deck);
        return deck;
    }
}

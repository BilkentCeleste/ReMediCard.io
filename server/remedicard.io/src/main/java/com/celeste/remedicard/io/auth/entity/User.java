package com.celeste.remedicard.io.auth.entity;

import com.celeste.remedicard.io.autogeneration.config.Language;
import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.notification.entity.Notification;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.spacedrepetition.entity.SpacedRepetition;
import com.celeste.remedicard.io.studystats.entity.StudyStats;
import com.celeste.remedicard.io.support.entity.Feedback;
import com.celeste.remedicard.io.usagestats.entity.UsageStats;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "remedicardio_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String username;

    private String email;
    private String previousPassword;
    private String password;
    private String resetCode;
    private Date resetCodeExpiry;
    private Role role;
    private String pushNotificationToken;
    private Language language;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Quiz> quizzes = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedbacks = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UsageStats> usageStats = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudyStats> studyStats = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Deck> decks = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SpacedRepetition> spacedRepetitionRecords;
}

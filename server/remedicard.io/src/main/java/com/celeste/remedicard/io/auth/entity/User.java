package com.celeste.remedicard.io.auth.entity;

import com.celeste.remedicard.io.deck.entity.Deck;
import com.celeste.remedicard.io.notification.entity.Notification;
import com.celeste.remedicard.io.quiz.entity.Quiz;
import com.celeste.remedicard.io.studyStats.entity.StudyStats;
import com.celeste.remedicard.io.usageStats.entity.UsageStats;
import com.celeste.remedicard.io.userFeedback.entity.UserFeedback;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications;

    @ManyToMany
    @JoinTable(
            name = "user_quiz",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id")
    )
    private Set<Quiz> quizzes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserFeedback> feedbacks;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UsageStats> usageStats;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudyStats> studyStats;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Deck> decks;
}

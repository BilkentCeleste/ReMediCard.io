package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.common.entity.URL;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SIDE")
public class Side extends AuditableEntity {

    @Column(columnDefinition = "TEXT")
    private String text;

    @ElementCollection
    @CollectionTable(name = "FLASHCARD_SIDE_URL", joinColumns = @JoinColumn(name = "SIDE_ID"))
    @Column(name = "URL")
    private Set<String> urlSet;
}

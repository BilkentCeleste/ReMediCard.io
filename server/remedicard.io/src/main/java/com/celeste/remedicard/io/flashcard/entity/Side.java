package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.net.URL;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "SIDE")
public class Side extends AuditableEntity {

    @Column
    private String text;

    @ElementCollection
    @CollectionTable(name = "FLASHCARD_SIDE_URL", joinColumns = @JoinColumn(name = "SIDE_ID"))
    @Column(name = "URL")
    private Set<URL> urlSet;
}

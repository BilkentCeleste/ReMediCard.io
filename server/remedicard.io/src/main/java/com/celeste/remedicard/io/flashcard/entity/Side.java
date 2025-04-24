package com.celeste.remedicard.io.flashcard.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.BeanUtils;

import java.util.Set;
import java.util.HashSet;

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

    @Column
    private String imageURL;

    public Side(Side frontSide) {
        BeanUtils.copyProperties(frontSide, this, "id", "urlSet");
        this.urlSet = new HashSet<>(frontSide.getUrlSet());
    }
}

package com.celeste.remedicard.io.figure.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "LABEL")
public class Label extends AuditableEntity {

    @Column
    private String title;

    @Column
    private int xPosition;

    @Column
    private int yPosition;

    @ManyToOne
    @JoinColumn(name = "figure_id", nullable = false)
    private Figure figure;
}



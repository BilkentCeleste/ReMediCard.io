package com.celeste.remedicard.io.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class AbstractEntity {

    @Id
    @Column(
            name = "ID",
            unique = true,
            nullable = false
    )
    @GeneratedValue (
            strategy = GenerationType.IDENTITY
    )
    protected Long id;
}

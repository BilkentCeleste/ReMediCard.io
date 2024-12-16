package com.celeste.remedicard.io.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@NoArgsConstructor
@Getter
@Setter
public class AbstractVersionedEntity extends AbstractEntity{

    @Version
    @Column(
            name = "VERSION"
    )
    private int version = 0;
}

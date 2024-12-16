package com.celeste.remedicard.io.usermedia.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "MEDIA_TEXT_DOC")
public class MediaTextDoc extends AuditableEntity {

    @Column
    private String transcript;
}

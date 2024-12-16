package com.celeste.remedicard.io.usermedia.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import com.celeste.remedicard.io.common.entity.URL;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "USER_MEDIA")
public class UserMedia extends AuditableEntity {

    @Column
    private URL link;

    @Column
    private String type;
}

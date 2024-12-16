package com.celeste.remedicard.io.caseStudy.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name= "CASE_STUDY")
public class CaseStudy extends AuditableEntity {

    @Column
    private String topic;

    @OneToMany(mappedBy = "caseStudy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Case> cases;
}

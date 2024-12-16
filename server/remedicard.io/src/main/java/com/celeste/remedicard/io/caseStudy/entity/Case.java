package com.celeste.remedicard.io.caseStudy.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "MEDICAL_CASE")
public class Case extends AuditableEntity {

    @Column
    private String topic;

    @Column
    private Integer difficulty;

    @Column
    private String disease;

    @ElementCollection
    @CollectionTable(name = "SYMPTOMS", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "symptom")
    private List<String> symptoms;

    @Column
    private String treatment;

    @Column
    private String description;

    @Column
    private String name;

    @ElementCollection
    @CollectionTable(name = "STEPS", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "step")
    private List<String> steps;

    @ManyToOne
    @JoinColumn(name = "case_study_id", nullable = false)
    private CaseStudy caseStudy;

}
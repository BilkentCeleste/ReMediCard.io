package com.celeste.remedicard.io.usageStats.entity;

import com.celeste.remedicard.io.auth.entity.User;
import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name= "USAGE_STATS")
public class UsageStats extends AuditableEntity {

    @Column
    private Integer aiGenerationCount;

    @Column
    private Integer flashCardCount;

    @Column
    private Integer mediaStorageVolume;

    @ElementCollection
    @CollectionTable(name = "session_dates", joinColumns = @JoinColumn(name = "entity_id"))
    @MapKeyColumn(name = "start_date")
    @Column(name = "end_date")
    private Map<Date, Date> sessions;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

package com.celeste.remedicard.io.deck.entity;

import com.celeste.remedicard.io.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "DECK_STATS")
public class DeckStats extends AuditableEntity {

    @Column
    private Long user_id;

    @Column
    private Long deck_id;

    @ElementCollection
    @CollectionTable(name = "DECK_ACCESS_DATES", joinColumns = @JoinColumn(name = "statistics_id"))
    @Column(name = "access_date")
    private Set<LocalDateTime> accessDates;

    @ElementCollection
    @CollectionTable(name = "DECK_SUCCESS_RATES", joinColumns = @JoinColumn(name = "statistics_id"))
    @Column(name = "success_rate")
    private List<Double> successRates;

    public void addAccessDate(LocalDateTime accessDate) {
        this.accessDates.add(accessDate);
    }

    public void addSuccessRate(double successRate) {
        this.successRates.add(successRate);
    }
}

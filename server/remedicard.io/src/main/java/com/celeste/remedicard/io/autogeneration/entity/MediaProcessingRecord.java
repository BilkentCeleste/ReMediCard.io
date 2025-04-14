package com.celeste.remedicard.io.autogeneration.entity;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class MediaProcessingRecord {
    @Id
    @GeneratedValue
    private Long id;

    @ElementCollection
    private List<String> fileNames;

    @ElementCollection
    private List<String> addresses;

    private DataType dataType;

    private Language language;

    private Boolean isProcessed;

    private Boolean isFilesCleaned;

    @CreatedDate
    private Date created;

    @LastModifiedDate
    private Date modified;
}

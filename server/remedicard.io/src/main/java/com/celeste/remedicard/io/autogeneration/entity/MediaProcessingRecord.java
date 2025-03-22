package com.celeste.remedicard.io.autogeneration.entity;

import com.celeste.remedicard.io.autogeneration.config.DataType;
import com.celeste.remedicard.io.autogeneration.config.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MediaProcessingRecord {
    @Id
    @GeneratedValue
    private Long id;

    private String fileName;

    private String address;

    private DataType dataType;

    private Language language;

    @CreatedDate
    private Date created;
}

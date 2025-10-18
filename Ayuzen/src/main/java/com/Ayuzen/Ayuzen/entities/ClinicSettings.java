package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Data
public class ClinicSettings {

    @Id
    private Long id; // Use a fixed ID (e.g., 1) for a single settings record

    private LocalTime openingTime;
    private LocalTime closingTime;
    private String workingDays; // e.g., "Monday,Tuesday,Wednesday,Thursday,Friday"
}
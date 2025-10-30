package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_time_blocks")
@Data
public class DoctorTimeBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime startTime; // Specific start date and time of unavailability

    @Column(nullable = false)
    private LocalDateTime endTime; // Specific end date and time of unavailability

    private String reason; // Optional: e.g., "Vacation", "Meeting"
}

package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability_rules")
@Data
public class DoctorAvailabilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek; // e.g., MONDAY, TUESDAY

    @Column(nullable = false)
    private LocalTime startTime; // e.g., 09:00:00

    @Column(nullable = false)
    private LocalTime endTime; // e.g., 13:00:00
}
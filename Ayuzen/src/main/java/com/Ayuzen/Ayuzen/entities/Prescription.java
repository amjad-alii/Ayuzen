package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data // Includes @Getter, @Setter, @ToString, etc.
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment; // Each prescription belongs to one appointment

    @Column(columnDefinition = "TEXT") // Allows for longer text
    private String diagnosis;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String medicines; // Store as JSON string or long text for simplicity initially

    @Column(columnDefinition = "TEXT")
    private String advice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist // Automatically set creation time before saving
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
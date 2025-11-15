package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dependents")
@Data
public class Dependent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String relationship; // e.g., "Spouse", "Child", "Parent"

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private int age;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The main account holder this dependent belongs to
}

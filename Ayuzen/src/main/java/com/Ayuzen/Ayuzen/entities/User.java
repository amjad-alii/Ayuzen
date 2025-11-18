package com.Ayuzen.Ayuzen.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phone;

    private String gender;

    private int age;

    @Enumerated(EnumType.STRING) // Stores the role as a string (e.g., "ROLE_PATIENT")
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    @Column(unique = true)
    private String abhaAddress;

    @Column(unique = true)
    private String abhaNumber;
}

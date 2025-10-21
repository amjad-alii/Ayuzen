package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserEmail(String email);
}

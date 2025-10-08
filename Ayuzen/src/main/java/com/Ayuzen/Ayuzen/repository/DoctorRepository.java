package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}

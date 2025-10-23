package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}
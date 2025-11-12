package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.PatientDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientDocumentRepository extends JpaRepository<PatientDocument, Long> {
    List<PatientDocument> findByUserId(Long userId);
}

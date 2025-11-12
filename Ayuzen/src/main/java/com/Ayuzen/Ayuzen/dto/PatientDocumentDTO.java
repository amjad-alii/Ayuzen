package com.Ayuzen.Ayuzen.dto;

import com.Ayuzen.Ayuzen.entities.User;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

public class PatientDocumentDTO {
    private User user;
    private String fileName;
    private String fileType; // e.g., "application/pdf"
    private String fileUrl; // The public URL from Firebase Storage
    private LocalDateTime uploadedAt;
}

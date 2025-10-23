package com.Ayuzen.Ayuzen.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PrescriptionDTO {
    private Long id;
    private Long appointmentId;
    private String diagnosis;
    private String medicines; // Frontend will likely send/receive this as a structured object, but backend handles as string for now
    private String advice;
    private LocalDateTime createdAt;
}
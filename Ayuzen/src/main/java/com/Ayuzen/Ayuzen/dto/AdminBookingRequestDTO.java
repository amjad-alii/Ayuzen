package com.Ayuzen.Ayuzen.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminBookingRequestDTO {
    private Long patientId; // The ID of the patient to book for
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private String notes;
}
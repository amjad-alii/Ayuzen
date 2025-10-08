package com.Ayuzen.Ayuzen.dto;
import com.Ayuzen.Ayuzen.entities.AppointmentStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;
    private Long userId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialty;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String notes;
}

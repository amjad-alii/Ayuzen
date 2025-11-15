package com.Ayuzen.Ayuzen.dto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private String notes;
    private Long dependentId;
}

package com.Ayuzen.Ayuzen.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DoctorTimeBlockDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String reason;
}
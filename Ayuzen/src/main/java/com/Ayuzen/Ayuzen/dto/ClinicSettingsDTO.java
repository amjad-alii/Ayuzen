package com.Ayuzen.Ayuzen.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ClinicSettingsDTO {
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String workingDays;
}

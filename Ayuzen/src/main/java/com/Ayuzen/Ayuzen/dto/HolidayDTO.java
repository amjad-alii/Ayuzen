package com.Ayuzen.Ayuzen.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HolidayDTO {
    private Long id;
    private LocalDate holidayDate;
    private String description;
}

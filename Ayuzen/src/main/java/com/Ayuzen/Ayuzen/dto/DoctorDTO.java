package com.Ayuzen.Ayuzen.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialty;
    private String qualification;
    private int experience;
    private String location;
    private double rating;
    private String imageUrl;
}

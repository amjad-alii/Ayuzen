package com.Ayuzen.Ayuzen.dto;

import lombok.Data;

@Data
public class DependentDTO {
    private Long id;
    private String fullName;
    private String relationship;
    private String gender;
    private int age;
}
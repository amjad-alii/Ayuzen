package com.Ayuzen.Ayuzen.dto;

import lombok.Data;

@Data
public class PatientAbhaDTO {
    // This will be used to send data to the ABDM API
    // Fields like aadhaarNumber, mobileNumber, etc.
    // For simplicity, we'll start with just the result.
    private String abhaNumber;
    private String abhaAddress; // e.g., amjad@abdm
}
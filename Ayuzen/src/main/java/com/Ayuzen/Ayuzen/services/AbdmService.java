package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PatientAbhaDTO;

public interface AbdmService {

    /**
     * Step 1: Initiates the ABHA creation process using a patient's Aadhaar or mobile.
     * This will call the ABDM API and get a transaction ID.
     * @return A transaction ID for the next step.
     */
    String initiateAbhaCreation(String mobileNumber, String userEmail);

    /**
     * Step 2: Verifies the OTP (sent to the patient's mobile) to create the ABHA.
     * @return The patient's new ABHA details.
     */
    PatientAbhaDTO verifyAbhaOtp(String transactionId, String otp);

    /**
     * Links an existing ABHA to the patient's account in our database.
     */
    void linkAbhaToUser(String userEmail, PatientAbhaDTO abhaDetails);
}

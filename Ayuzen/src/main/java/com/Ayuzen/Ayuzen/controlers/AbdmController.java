package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.PatientAbhaDTO;
import com.Ayuzen.Ayuzen.services.AbdmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/abdm")
@PreAuthorize("hasAuthority('ROLE_PATIENT')")
public class AbdmController {

    @Autowired
    private AbdmService abdmService;

    // Endpoint for Step 1: Start ABHA creation (e.g., via mobile OTP)
    @PostMapping("/initiate-abha")
    public ResponseEntity<String> initiateAbha(Authentication authentication, @RequestBody String mobileNumber) {
        String userEmail = authentication.getName();
        String transactionId = abdmService.initiateAbhaCreation(mobileNumber, userEmail);
        return ResponseEntity.ok(transactionId);
    }

    // Endpoint for Step 2: Verify OTP and create ABHA
    @PostMapping("/verify-abha-otp")
    public ResponseEntity<PatientAbhaDTO> verifyAbha(
            Authentication authentication,
            @RequestParam String transactionId,
            @RequestParam String otp) {

        PatientAbhaDTO abhaDetails = abdmService.verifyAbhaOtp(transactionId, otp);

        // Link the new ABHA to the patient's account
        abdmService.linkAbhaToUser(authentication.getName(), abhaDetails);

        return ResponseEntity.ok(abhaDetails);
    }
}

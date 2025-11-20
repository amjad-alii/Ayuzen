package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PatientAbhaDTO;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AbdmServiceImpl implements AbdmService {

    @Autowired
    private UserRepository userRepository;

    // --- MOCK CONSTANTS (In a real app, these would come from the external ABDM API) ---
    private static final String MOCK_TXN_ID = "txn123456789";
    private static final String MOCK_VALID_OTP = "000000";
    // --- END MOCK CONSTANTS ---

    /**
     * Step 1: Simulates calling the ABDM Gateway to initiate ABHA creation/linking.
     * @return A transaction ID required for the next step.
     */
    @Override
    public String initiateAbhaCreation(String mobileNumber, String userEmail) {
        // In a real application, you would use RestTemplate/WebClient here to call the ABDM API.
        // It would check if the mobile number matches the Aadhaar record and send an OTP.

        System.out.println("ABDM: Initiating ABHA creation for user " + userEmail + " via mobile " + mobileNumber);

        // --- MOCK RESPONSE: Return a hardcoded transaction ID ---
        return MOCK_TXN_ID;
    }

    /**
     * Step 2: Simulates calling the ABDM Gateway to verify the OTP and finalize ABHA details.
     * @return The patient's new ABHA details.
     */
    @Override
    public PatientAbhaDTO verifyAbhaOtp(String transactionId, String otp) {
        // Validate mock transaction ID and OTP
        if (!MOCK_TXN_ID.equals(transactionId) || !MOCK_VALID_OTP.equals(otp)) {
            throw new RuntimeException("ABDM Verification Failed: Invalid Transaction ID or OTP.");
        }

        // --- MOCK RESPONSE: Return successful ABHA details ---
        PatientAbhaDTO abhaDetails = new PatientAbhaDTO();
        abhaDetails.setAbhaNumber("12-3456-7890-1234");
        abhaDetails.setAbhaAddress("testuser" + System.currentTimeMillis() + "@abdm"); // Unique address
        return abhaDetails;
    }

    /**
     * Step 3: Links the newly created/verified ABHA details to the patient's record in our database.
     */
    @Override
    @Transactional
    public void linkAbhaToUser(String userEmail, PatientAbhaDTO abhaDetails) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found in local database."));

        // Check for existing ABHA details (in case user refreshes)
        if (user.getAbhaNumber() != null) {
            return;
        }

        user.setAbhaNumber(abhaDetails.getAbhaNumber());
        user.setAbhaAddress(abhaDetails.getAbhaAddress());
        userRepository.save(user);

        System.out.println("ABDM: Successfully linked ABHA ID: " + abhaDetails.getAbhaNumber());
    }
}

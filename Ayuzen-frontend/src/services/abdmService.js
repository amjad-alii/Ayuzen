import apiClient from './authService';

/**
 * Fetches the current user's ABHA status/details.
 */
export const getAbhaStatusApi = async () => {
    // You'll need to add a GET endpoint to your AbdmController for this
    // or fetch the user profile again. For now, let's assume a specific endpoint.
    const response = await apiClient.get('/abdm/status'); 
    return response.data;
};

/**
 * Step 1: Initiate ABHA creation by sending an OTP to the mobile number.
 * @param {string} mobileNumber 
 */
export const initiateAbhaCreationApi = async (mobileNumber) => {
    const response = await apiClient.post('/abdm/initiate-abha', { mobileNumber });
    return response.data; // Should return a transactionId
};

/**
 * Step 2: Verify the OTP to create/link the ABHA.
 * @param {string} transactionId 
 * @param {string} otp 
 */
export const verifyAbhaOtpApi = async (transactionId, otp) => {
    const response = await apiClient.post('/abdm/verify-abha-otp', { 
        transactionId, 
        otp 
    });
    return response.data; // Should return the new ABHA details
};
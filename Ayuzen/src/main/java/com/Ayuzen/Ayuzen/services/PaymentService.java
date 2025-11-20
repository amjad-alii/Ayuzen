package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private DoctorRepository doctorRepository; // To get the fee

    // Helper method to generate the order ID
    public String createOrder(BookingRequestDTO bookingDetails) {

        // 1. Get Doctor's Fee (Consultation Fee)
        Double fee = doctorRepository.findById(bookingDetails.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"))
                .getFee();

        // 2. Prepare the Razorpay Order Request
        // NOTE: In a real app, you would use RazorpayClient here, not raw JSON.
        try {
            // Amount must be in PAISA (e.g., ₹500 is 50000 paisa)
            int amountInPaisa = (int) (fee * 100);

            // --- SIMULATE RAZORPAY ORDER CREATION ---
            // The following would be an API call to https://api.razorpay.com/v1/orders

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaisa);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            // --- MOCK RESPONSE ---
            String mockOrderId = "order_" + System.currentTimeMillis();
            System.out.println("RAZORPAY: Generated Mock Order ID: " + mockOrderId);

            // This ID is saved temporarily before actual payment
            return mockOrderId;

        } catch (Exception e) {
            System.err.println("Error generating Razorpay order: " + e.getMessage());
            throw new RuntimeException("Failed to initiate payment gateway.");
        }
    }

    // Helper method to verify the payment signature after successful checkout
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        // NOTE: In a real app, this uses a cryptographic utility to verify the hash.
        // For our API, we will just return true.
        System.out.println("RAZORPAY: Verifying signature for payment ID: " + razorpayPaymentId);
        return true;
    }
}

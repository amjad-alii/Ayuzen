package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private DoctorRepository doctorRepository;

    /**
     * Creates a new order on the payment gateway backend.
     */
    public String createOrder(BookingRequestDTO bookingDetails) {

        if (bookingDetails.getDoctorId() == null) {
            throw new RuntimeException("Booking initiation failed: Doctor ID is missing.");
        }

        // 1. Retrieve the Doctor entity
        Doctor doctor = doctorRepository.findById(bookingDetails.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found for ID: " + bookingDetails.getDoctorId()));

        // 2. CRITICAL FIX: Safely handle potentially NULL fee from the database.
        // If doctor.getFee() is null (e.g., if the fee field in the DB is nullable and empty),
        // we default it to 0.0 to prevent NPE.
        double fee = doctor.getFee();
        if (fee == 0.0) {
            throw new RuntimeException("Doctor fee is not set. Cannot proceed with payment.");
        }

        // 3. Amount must be in PAISA (e.g., ₹500 is 50000 paisa)
        int amountInPaisa = (int) (fee * 100);

        // --- MOCK RAZORPAY ORDER CREATION ---
        try {
            String mockOrderId = "order_" + UUID.randomUUID().toString().substring(0, 8);
            System.out.println("RAZORPAY: Generated Mock Order ID: " + mockOrderId);

            JSONObject responseJson = new JSONObject();
            responseJson.put("order_id", mockOrderId);
            responseJson.put("key_id", razorpayKeyId);
            responseJson.put("amount_paisa", amountInPaisa);

            return responseJson.toString();

        } catch (Exception e) {
            System.err.println("Error generating Razorpay order: " + e.getMessage());
            throw new RuntimeException("Failed to initiate payment gateway.");
        }
    }

    /**
     * Simulates signature verification (Crucial Security Check).
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        System.out.println("RAZORPAY: Simulating successful signature verification.");
        return true;
    }
}
package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.services.PaymentService;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired private PaymentService paymentService;
    @Autowired private AppointmentService appointmentService; // To finalize the booking

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    // --- ENDPOINT 1: INITIATE ORDER ---
    // This is called just before opening the payment modal
    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody BookingRequestDTO bookingDetails) {
        try {
            String orderId = paymentService.createOrder(bookingDetails);

            // We return a simple JSON object containing the orderId and KeyId needed by the frontend
            String responseBody = String.format("{\"order_id\":\"%s\", \"key_id\":\"%s\"}", orderId, razorpayKeyId);

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}

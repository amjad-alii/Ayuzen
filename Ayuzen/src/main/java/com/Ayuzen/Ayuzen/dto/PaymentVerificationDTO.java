package com.Ayuzen.Ayuzen.dto;

import lombok.Data;

@Data
public class PaymentVerificationDTO {
    // Payment details from Razorpay callback
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;

    // Original booking details for final processing
    private Long doctorId;
    private Long dependentId; // Nullable
    private String appointmentDateTime;
}

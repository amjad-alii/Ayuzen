package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PrescriptionDTO;

public interface PrescriptionService {
    PrescriptionDTO createPrescription(Long appointmentId, PrescriptionDTO prescriptionDTO, String doctorEmail);
}
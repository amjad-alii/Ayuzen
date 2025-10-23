package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PrescriptionDTO;
import com.Ayuzen.Ayuzen.entities.Appointment;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.entities.Prescription;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import com.Ayuzen.Ayuzen.repository.PrescriptionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(Long appointmentId, PrescriptionDTO prescriptionDTO, String doctorEmail) {
        // 1. Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // 2. Find the logged-in doctor
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // 3. Security Check: Ensure the appointment belongs to the logged-in doctor
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("Doctor is not authorized to create a prescription for this appointment.");
        }

        // 4. Map DTO to entity and set relationships
        Prescription prescription = modelMapper.map(prescriptionDTO, Prescription.class);
        prescription.setAppointment(appointment); // Link to the appointment
        prescription.setId(null); // Ensure it's treated as a new record

        // 5. Save and return DTO
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return modelMapper.map(savedPrescription, PrescriptionDTO.class);
    }
}
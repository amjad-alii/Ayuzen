package com.Ayuzen.Ayuzen.controlers;



import com.Ayuzen.Ayuzen.dto.*;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import com.Ayuzen.Ayuzen.services.DoctorAvailabilityService;
import com.Ayuzen.Ayuzen.services.DoctorService;
import com.Ayuzen.Ayuzen.services.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private PrescriptionService prescriptionService;
    @Autowired
    private DoctorAvailabilityService availabilityService;

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentDTO>> getMySchedule(Authentication authentication) {
        String doctorEmail = authentication.getName();
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsForDoctor(doctorEmail);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<List<AppointmentDTO>> getPatientHistory(
            @PathVariable Long patientId,
            Authentication authentication) {

        String doctorEmail = authentication.getName();
        List<AppointmentDTO> history = appointmentService.getPatientHistoryForDoctor(doctorEmail, patientId);
        return ResponseEntity.ok(history);
    }
    @PostMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<PrescriptionDTO> createPrescription(
            @PathVariable Long appointmentId,
            @RequestBody PrescriptionDTO prescriptionDTO,
            Authentication authentication) {

        String doctorEmail = authentication.getName();
        PrescriptionDTO createdPrescription = prescriptionService.createPrescription(appointmentId, prescriptionDTO, doctorEmail);
        return new ResponseEntity<>(createdPrescription, HttpStatus.CREATED);
    }

    // --- NEW AVAILABILITY ENDPOINTS ---

    @GetMapping("/availability/rules")
    public ResponseEntity<List<DoctorAvailabilityRuleDTO>> getAvailabilityRules(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(availabilityService.getAvailabilityRules(email));
    }

    @PutMapping("/availability/rules")
    public ResponseEntity<List<DoctorAvailabilityRuleDTO>> setAvailabilityRules(
            @RequestBody List<DoctorAvailabilityRuleDTO> rules, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(availabilityService.setAvailabilityRules(email, rules));
    }

    @GetMapping("/availability/blocks")
    public ResponseEntity<List<DoctorTimeBlockDTO>> getTimeBlocks(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(availabilityService.getTimeBlocks(email));
    }

    @PostMapping("/availability/blocks")
    public ResponseEntity<DoctorTimeBlockDTO> addTimeBlock(
            @RequestBody DoctorTimeBlockDTO block, Authentication authentication) {
        String email = authentication.getName();
        DoctorTimeBlockDTO newBlock = availabilityService.addTimeBlock(email, block);
        return new ResponseEntity<>(newBlock, HttpStatus.CREATED);
    }

    @DeleteMapping("/availability/blocks/{blockId}")
    public ResponseEntity<Void> deleteTimeBlock(@PathVariable Long blockId, Authentication authentication) {
        String email = authentication.getName();
        availabilityService.deleteTimeBlock(email, blockId);
        return ResponseEntity.noContent().build();
    }
}

package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.DoctorDTO;
import com.Ayuzen.Ayuzen.services.AvailabilityService;
import com.Ayuzen.Ayuzen.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private AvailabilityService availabilityService;

    // 1. ENDPOINT TO GET ALL DOCTORS (e.g., /api/public/doctors)
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // 2. ENDPOINT TO GET A SINGLE DOCTOR PROFILE (e.g., /api/public/doctors/{id})
    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // 3. ENDPOINT FOR GETTING AVAILABLE SLOTS (e.g., /api/public/doctors/{id}/availability)
    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<List<LocalDateTime>> getDoctorAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<LocalDateTime> slots = availabilityService.getAvailableSlots(id, date);
        return ResponseEntity.ok(slots);
    }
}
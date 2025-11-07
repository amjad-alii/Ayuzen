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
@RequestMapping("/api") // Mapped to the public root /api
public class PublicController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private AvailabilityService availabilityService;

    // This is the public endpoint to get all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // THIS IS THE NEW ENDPOINT for getting available slots
    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<List<LocalDateTime>> getDoctorAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<LocalDateTime> slots = availabilityService.getAvailableSlots(id, date);
        return ResponseEntity.ok(slots);
    }
}
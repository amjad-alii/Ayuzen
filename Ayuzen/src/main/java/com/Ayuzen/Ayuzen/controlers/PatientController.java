package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments") // This controller handles all routes starting with /api/appointments
@PreAuthorize("hasAuthority('ROLE_PATIENT')") // Secures all methods in this controller for patients
public class PatientController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(
            @RequestBody BookingRequestDTO bookingRequestDTO,
            Authentication authentication) {

        // Get the logged-in patient's email from the security context
        String userEmail = authentication.getName();

        // Call your existing service method
        AppointmentDTO newAppointment = appointmentService.createAppointment(bookingRequestDTO, userEmail);

        return new ResponseEntity<>(newAppointment, HttpStatus.CREATED);
    }
}

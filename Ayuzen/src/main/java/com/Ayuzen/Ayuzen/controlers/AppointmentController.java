package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.entities.AppointmentStatus;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
// We will secure the methods individually instead of the whole class
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // The conflicting POST /api/appointments method has been REMOVED from this file.
    // It is now correctly handled by PatientController.java.

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')") // Secure this method for patients
    public ResponseEntity<List<AppointmentDTO>> getMyAppointment(Authentication authentication) {
        String userEmail = authentication.getName();
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsForUser(userEmail);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')") // Secure this method for patients
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        appointmentService.cancelAppointment(id, userEmail);
        return ResponseEntity.noContent().build();
    }

    // This endpoint is for Admins, but it's okay to have it in this controller
    // as long as the security is on the method.
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_RECEPTIONIST')")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }
}
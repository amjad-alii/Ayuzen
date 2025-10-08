package com.Ayuzen.Ayuzen.controlers;
import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody BookingRequestDTO bookingRequestDTO, Authentication authentication) {
        // Get the authenticated user's email from the security context
        String userEmail = authentication.getName();
        AppointmentDTO createdAppointment = appointmentService.createAppointment(bookingRequestDTO, userEmail);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointment(Authentication authentication) {
        String userEmail = authentication.getName();
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsForUser(userEmail);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        appointmentService.cancelAppointment(id, userEmail);
        return ResponseEntity.noContent().build(); // Return 204 No Content on success
    }
}
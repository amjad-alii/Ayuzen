package com.Ayuzen.Ayuzen.controlers;



import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.DoctorDTO;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import com.Ayuzen.Ayuzen.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private AppointmentService appointmentService;

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
}

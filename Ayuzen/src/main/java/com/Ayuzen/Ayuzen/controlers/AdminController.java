package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.*;
import com.Ayuzen.Ayuzen.entities.AppointmentStatus;
import com.Ayuzen.Ayuzen.entities.Role;
import com.Ayuzen.Ayuzen.services.AdminService;
import com.Ayuzen.Ayuzen.services.AppointmentService;
import com.Ayuzen.Ayuzen.services.DoctorService;
import com.Ayuzen.Ayuzen.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;


    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }



    // PUT to update an existing doctor
    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO updatedDoctor = doctorService.updateDoctor(id, doctorDTO);
        return ResponseEntity.ok(updatedDoctor);
    }

    // DELETE a doctor
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDTO>> getAllClinicAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }


    // ENDPOINT TO BOOK FOR A PATIENT
    @PostMapping("/appointments/book")
    public ResponseEntity<AppointmentDTO> bookForPatient(@RequestBody AdminBookingRequestDTO bookingRequest) {
        AppointmentDTO newAppointment = appointmentService.createAppointmentForPatient(bookingRequest);
        return new ResponseEntity<>(newAppointment, HttpStatus.CREATED);
    }

    // ENDPOINT TO GET ALL PATIENTS FOR DROPDOWN
    @GetMapping("/patients")
    public ResponseEntity<List<PatientListDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    // ENDPOINT TO GET A SINGLE PATIENT'S DETAILS
    @GetMapping("/patients/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_RECEPTIONIST')")
    public ResponseEntity<UserDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // ENDPOINT TO GET A SINGLE PATIENT'S APPOINTMENT HISTORY
    @GetMapping("/patients/{id}/appointments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_RECEPTIONIST')")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(id));
    }
}
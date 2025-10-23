package com.Ayuzen.Ayuzen.services;
import com.Ayuzen.Ayuzen.dto.AdminBookingRequestDTO;
import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.entities.AppointmentStatus;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO createAppointment(BookingRequestDTO bookingRequestDTO, String userEmail);
    List<AppointmentDTO> getAppointmentsForUser(String userEmail);
    void cancelAppointment(Long appointmentId, String userEmail);
    List<AppointmentDTO> getAllAppointments();
    AppointmentDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status);
    AppointmentDTO createAppointmentForPatient(AdminBookingRequestDTO bookingRequest);
    List<AppointmentDTO> getAppointmentsForPatient(Long patientId);
    List<AppointmentDTO> getAppointmentsForDoctor(String doctorEmail);
    List<AppointmentDTO> getPatientHistoryForDoctor(String doctorEmail, Long patientId);
}
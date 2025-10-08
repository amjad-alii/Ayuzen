package com.Ayuzen.Ayuzen.services;
import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import java.util.List;

public interface AppointmentService {
    AppointmentDTO createAppointment(BookingRequestDTO bookingRequestDTO, String userEmail);
    List<AppointmentDTO> getAppointmentsForUser(String userEmail);
    void cancelAppointment(Long appointmentId, String userEmail);
}
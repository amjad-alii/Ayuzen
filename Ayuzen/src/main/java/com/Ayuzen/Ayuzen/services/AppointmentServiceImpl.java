package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.AdminBookingRequestDTO;
import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.entities.Appointment;
import com.Ayuzen.Ayuzen.entities.AppointmentStatus;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.Builder;
import org.modelmapper.ModelMapper; // 1. Import ModelMapper
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Builder
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ModelMapper modelMapper; // 2. Inject the ModelMapper bean

    @Override
    public AppointmentDTO createAppointment(BookingRequestDTO bookingRequestDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Doctor doctor = doctorRepository.findById(bookingRequestDTO.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .user(user)
                .doctor(doctor)
                .appointmentDateTime(bookingRequestDTO.getAppointmentDateTime())
                .status(AppointmentStatus.CONFIRMED)
                .notes(bookingRequestDTO.getNotes())
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        // 3. Use ModelMapper for conversion
        return modelMapper.map(savedAppointment, AppointmentDTO.class);
    }

    @Override
    public List<AppointmentDTO> getAppointmentsForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Appointment> appointments = appointmentRepository.findByUserId(user.getId());

        // 4. Use ModelMapper in the stream
        return appointments.stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Security Check: Ensure the appointment belongs to the user trying to cancel it
        if (!appointment.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to cancel this appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return modelMapper.map(updatedAppointment, AppointmentDTO.class);
    }

    // ... inside AppointmentServiceImpl.java

    @Override
    @Transactional
    public AppointmentDTO createAppointmentForPatient(AdminBookingRequestDTO bookingRequest) {
        User patient = userRepository.findById(bookingRequest.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(bookingRequest.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .user(patient)
                .doctor(doctor)
                .appointmentDateTime(bookingRequest.getAppointmentDateTime())
                .status(AppointmentStatus.CONFIRMED) // Admin bookings are confirmed by default
                .notes(bookingRequest.getNotes())
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return modelMapper.map(savedAppointment, AppointmentDTO.class);
    }

    // 5. The manual convertToDto method is no longer needed and can be deleted.
}
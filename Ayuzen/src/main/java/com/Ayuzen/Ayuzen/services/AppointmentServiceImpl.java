package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.AdminBookingRequestDTO;
import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.dto.BookingRequestDTO;
import com.Ayuzen.Ayuzen.entities.*;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import com.Ayuzen.Ayuzen.repository.DependentRepository;
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

    @Autowired
    private DependentRepository dependentRepository;

    public AppointmentDTO createAppointment(BookingRequestDTO bookingRequestDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Doctor doctor = doctorRepository.findById(bookingRequestDTO.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setUser(user); // The user who is booking
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(bookingRequestDTO.getAppointmentDateTime());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setNotes(bookingRequestDTO.getNotes());

        // --- 2. THIS IS THE UPDATED LOGIC ---
        if (bookingRequestDTO.getDependentId() != null) {
            // If a dependentId is provided, find the dependent
            Dependent dependent = dependentRepository.findById(bookingRequestDTO.getDependentId())
                    .orElseThrow(() -> new RuntimeException("Dependent not found"));

            // Security check: Make sure the dependent belongs to the logged-in user
            if (!dependent.getUser().getId().equals(user.getId())) {
                throw new AccessDeniedException("This dependent does not belong to your account.");
            }
            // Set the appointment for the dependent
            appointment.setDependent(dependent);
        }
        // If dependentId is null, the appointment is for the main user (appointment.dependent remains null)
        // --- END OF UPDATED LOGIC ---

        Appointment savedAppointment = appointmentRepository.save(appointment);
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

    @Override
    @Transactional
    public List<AppointmentDTO> getAppointmentsForPatient(Long patientId) {
        // We already have the findByUserId method in the repository
        List<Appointment> appointments = appointmentRepository.findByUserId(patientId);
        return appointments.stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getAppointmentsForDoctor(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for email: " + doctorEmail));

        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());

        return appointments.stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getPatientHistoryForDoctor(String doctorEmail, Long patientId) {

        // 1. Find the logged-in doctor
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for email: " + doctorEmail));

        // 2. Fetch appointments using the new, secure repository method
        // This ensures a doctor can only see their OWN appointments with this patient.
        List<Appointment> appointments = appointmentRepository.findByUserIdAndDoctorId(patientId, doctor.getId());

        // 3. Map to DTOs and return
        return appointments.stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentDTO.class))
                .collect(Collectors.toList());
    }
    // 5. The manual convertToDto method is no longer needed and can be deleted.
}
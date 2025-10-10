package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DashboardStatsDTO;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        // Fetch the total number of doctors
        long totalDoctors = doctorRepository.count();

        // Define the start and end of the current day
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // Use custom repository methods to calculate stats for today
        long appointmentsToday = appointmentRepository.countByAppointmentDateTimeBetween(startOfDay, endOfDay);
        Double totalRevenueToday = appointmentRepository.findTotalRevenueForDay(startOfDay, endOfDay);

        // Build and return the DTO
        return DashboardStatsDTO.builder()
                .totalDoctors(totalDoctors)
                .appointmentsToday(appointmentsToday)
                // If revenue is null (no confirmed appointments), return 0.0
                .totalRevenueToday(totalRevenueToday == null ? 0.0 : totalRevenueToday)
                .build();
    }
}


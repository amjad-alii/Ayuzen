package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.entities.Appointment;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationTaskService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    // This cron expression means "run at the top of every hour"
    // (e.g., at 1:00, 2:00, 3:00)
    @Scheduled(cron = "0 0 * * * *")
    public void sendAppointmentReminders() {
        System.out.println("--- Running Reminder Task ---");

        // Define the 24-hour window we want to check (e.g., from 23:59 to 24:59 hours from now)
        // This ensures we catch appointments exactly one day away.
        LocalDateTime windowStart = LocalDateTime.now().plusHours(23);
        LocalDateTime windowEnd = LocalDateTime.now().plusHours(25);

        // 1. Find all confirmed appointments in the window
        List<Appointment> upcomingAppointments =
                appointmentRepository.findConfirmedAppointmentsInWindow(windowStart, windowEnd);

        System.out.println("Found " + upcomingAppointments.size() + " appointments to remind.");

        // 2. Loop through and send an email for each one
        for (Appointment appointment : upcomingAppointments) {
            System.out.println("Sending reminder for appointment ID: " + appointment.getId());
            emailService.sendReminderEmail(appointment);
        }

        System.out.println("--- Reminder Task Finished ---");
    }
}
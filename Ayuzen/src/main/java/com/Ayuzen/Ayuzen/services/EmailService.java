package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.entities.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReminderEmail(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your-email@gmail.com"); // Must be the same as in your properties
            message.setTo(appointment.getUser().getEmail());

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("eeee, MMMM d");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

            String subject = "Appointment Reminder: Tomorrow with Dr. " + appointment.getDoctor().getName();
            String text = String.format(
                    "Dear %s,\n\n" +
                            "This is a reminder for your upcoming appointment with Dr. %s.\n\n" +
                            "Date: %s\n" +
                            "Time: %s\n\n" +
                            "If you need to cancel or reschedule, please contact the clinic.\n\n" +
                            "Thank you,\n" +
                            "Ayuzen Clinic",
                    appointment.getUser().getFullName(),
                    appointment.getDoctor().getName(),
                    appointment.getAppointmentDateTime().format(dateFormatter),
                    appointment.getAppointmentDateTime().format(timeFormatter)
            );

            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
        } catch (Exception e) {
            // Log the error, but don't stop the whole process
            System.err.println("Failed to send email for appointment " + appointment.getId() + ": " + e.getMessage());
        }
    }
}
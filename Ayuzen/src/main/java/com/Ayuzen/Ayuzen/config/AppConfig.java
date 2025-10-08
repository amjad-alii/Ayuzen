package com.Ayuzen.Ayuzen.config;

import com.Ayuzen.Ayuzen.dto.AppointmentDTO;
import com.Ayuzen.Ayuzen.entities.Appointment;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Custom mapping configuration for converting Appointment entity to AppointmentDTO
        PropertyMap<Appointment, AppointmentDTO> appointmentMap = new PropertyMap<>() {
            protected void configure() {
                // Map the user's full name to the DTO's patientName field
                map().setPatientName(source.getUser().getFullName());

                // Map the doctor's name to the DTO's doctorName field
                map().setDoctorName(source.getDoctor().getName());

                // ADD THIS LINE: Map the doctor's specialty to the DTO's doctorSpecialty field
                map().setDoctorSpecialty(source.getDoctor().getSpecialty());
            }
        };

        modelMapper.addMappings(appointmentMap);

        return modelMapper;
    }
}
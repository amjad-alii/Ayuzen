package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DoctorDTO;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import org.modelmapper.ModelMapper; // Import ModelMapper
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ModelMapper modelMapper; // Inject the ModelMapper bean

    @Override
    public List<DoctorDTO> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        // Use ModelMapper to convert the whole list
        return doctors.stream()
                .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                .collect(Collectors.toList());
    }
}
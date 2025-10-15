package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PatientListDTO;
import com.Ayuzen.Ayuzen.dto.UserDTO;
import com.Ayuzen.Ayuzen.entities.Role;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<PatientListDTO> getAllPatients() {
        // This is the correct place for this logic
        return userRepository.findAllByRole(Role.ROLE_PATIENT)
                .stream()
                .map(user -> modelMapper.map(user, PatientListDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getPatientById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        return modelMapper.map(user, UserDTO.class);
    }
}

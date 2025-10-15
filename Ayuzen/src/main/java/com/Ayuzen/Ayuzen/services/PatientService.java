package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PatientListDTO;
import com.Ayuzen.Ayuzen.dto.UserDTO;

import java.util.List;

public interface PatientService {
    List<PatientListDTO> getAllPatients();
    UserDTO getPatientById(Long id);
}

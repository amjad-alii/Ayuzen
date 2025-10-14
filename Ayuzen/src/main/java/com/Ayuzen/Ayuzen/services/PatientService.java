package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.PatientListDTO;
import java.util.List;

public interface PatientService {
    List<PatientListDTO> getAllPatients();
}

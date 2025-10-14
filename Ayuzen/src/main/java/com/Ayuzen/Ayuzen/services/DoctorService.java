package com.Ayuzen.Ayuzen.services;
import com.Ayuzen.Ayuzen.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    void deleteDoctor(Long id);
}

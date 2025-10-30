package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DoctorAvailabilityRuleDTO;
import com.Ayuzen.Ayuzen.dto.DoctorTimeBlockDTO;

import java.util.List;

public interface DoctorAvailabilityService {
    List<DoctorAvailabilityRuleDTO> getAvailabilityRules(String doctorEmail);
    List<DoctorAvailabilityRuleDTO> setAvailabilityRules(String doctorEmail, List<DoctorAvailabilityRuleDTO> rules);
    List<DoctorTimeBlockDTO> getTimeBlocks(String doctorEmail);
    DoctorTimeBlockDTO addTimeBlock(String doctorEmail, DoctorTimeBlockDTO block);
    void deleteTimeBlock(String doctorEmail, Long blockId);
}

package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DoctorAvailabilityRuleDTO;
import com.Ayuzen.Ayuzen.dto.DoctorTimeBlockDTO;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.entities.DoctorAvailabilityRule;
import com.Ayuzen.Ayuzen.entities.DoctorTimeBlock;
import com.Ayuzen.Ayuzen.repository.DoctorAvailabilityRuleRepository;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import com.Ayuzen.Ayuzen.repository.DoctorTimeBlockRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired private DoctorRepository doctorRepository;
    @Autowired private DoctorAvailabilityRuleRepository ruleRepository;
    @Autowired private DoctorTimeBlockRepository blockRepository;
    @Autowired private ModelMapper modelMapper;

    private Doctor findDoctorByEmail(String email) {
        return doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for email: " + email));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorAvailabilityRuleDTO> getAvailabilityRules(String doctorEmail) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        return ruleRepository.findByDoctorId(doctor.getId()).stream()
                .map(rule -> modelMapper.map(rule, DoctorAvailabilityRuleDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<DoctorAvailabilityRuleDTO> setAvailabilityRules(String doctorEmail, List<DoctorAvailabilityRuleDTO> ruleDTOs) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        // Clear existing rules for this doctor
        ruleRepository.deleteByDoctorId(doctor.getId());

        // Save the new rules
        List<DoctorAvailabilityRule> newRules = ruleDTOs.stream().map(dto -> {
            DoctorAvailabilityRule rule = modelMapper.map(dto, DoctorAvailabilityRule.class);
            rule.setDoctor(doctor);
            rule.setId(null); // Ensure it's treated as new
            return rule;
        }).collect(Collectors.toList());

        List<DoctorAvailabilityRule> savedRules = ruleRepository.saveAll(newRules);

        return savedRules.stream()
                .map(rule -> modelMapper.map(rule, DoctorAvailabilityRuleDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorTimeBlockDTO> getTimeBlocks(String doctorEmail) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        return blockRepository.findByDoctorId(doctor.getId()).stream()
                .map(block -> modelMapper.map(block, DoctorTimeBlockDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorTimeBlockDTO addTimeBlock(String doctorEmail, DoctorTimeBlockDTO blockDTO) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        DoctorTimeBlock block = modelMapper.map(blockDTO, DoctorTimeBlock.class);
        block.setDoctor(doctor);
        block.setId(null); // Ensure it's treated as new
        DoctorTimeBlock savedBlock = blockRepository.save(block);
        return modelMapper.map(savedBlock, DoctorTimeBlockDTO.class);
    }

    @Override
    @Transactional
    public void deleteTimeBlock(String doctorEmail, Long blockId) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        DoctorTimeBlock block = blockRepository.findById(blockId)
                .orElseThrow(() -> new RuntimeException("Time block not found"));

        // Security check: ensure the block belongs to the logged-in doctor
        if (!block.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this time block.");
        }
        blockRepository.deleteById(blockId);
    }
}

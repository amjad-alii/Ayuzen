package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.ClinicSettingsDTO;
import com.Ayuzen.Ayuzen.dto.HolidayDTO;
import com.Ayuzen.Ayuzen.entities.ClinicSettings;
import com.Ayuzen.Ayuzen.entities.Holiday;
import com.Ayuzen.Ayuzen.repository.ClinicSettingsRepository;
import com.Ayuzen.Ayuzen.repository.HolidayRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicSettingsServiceImpl implements ClinicSettingsService {

    @Autowired
    private ClinicSettingsRepository settingsRepository;
    @Autowired
    private HolidayRepository holidayRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ClinicSettingsDTO getClinicSettings() {
        ClinicSettings settings = settingsRepository.findById(1L).orElse(new ClinicSettings()); // Default if not found
        return modelMapper.map(settings, ClinicSettingsDTO.class);
    }

    @Override
    public ClinicSettingsDTO updateClinicSettings(ClinicSettingsDTO settingsDTO) {
        ClinicSettings settings = modelMapper.map(settingsDTO, ClinicSettings.class);
        settings.setId(1L); // Always update the same record
        ClinicSettings updatedSettings = settingsRepository.save(settings);
        return modelMapper.map(updatedSettings, ClinicSettingsDTO.class);
    }

    @Override
    public List<HolidayDTO> getAllHolidays() {
        return holidayRepository.findAll().stream()
                .map(holiday -> modelMapper.map(holiday, HolidayDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public HolidayDTO addHoliday(HolidayDTO holidayDTO) {
        Holiday holiday = modelMapper.map(holidayDTO, Holiday.class);
        Holiday savedHoliday = holidayRepository.save(holiday);
        return modelMapper.map(savedHoliday, HolidayDTO.class);
    }

    @Override
    public void deleteHoliday(Long holidayId) {
        holidayRepository.deleteById(holidayId);
    }
}

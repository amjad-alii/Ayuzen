package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.ClinicSettingsDTO;
import com.Ayuzen.Ayuzen.dto.HolidayDTO;
import java.util.List;

public interface ClinicSettingsService {
    ClinicSettingsDTO getClinicSettings();
    ClinicSettingsDTO updateClinicSettings(ClinicSettingsDTO settingsDTO);
    List<HolidayDTO> getAllHolidays();
    HolidayDTO addHoliday(HolidayDTO holidayDTO);
    void deleteHoliday(Long holidayId);
}

package com.Ayuzen.Ayuzen.controllers;

import com.Ayuzen.Ayuzen.dto.ClinicSettingsDTO;
import com.Ayuzen.Ayuzen.dto.HolidayDTO;
import com.Ayuzen.Ayuzen.services.ClinicSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
// THIS IS THE FIX: The URL now correctly starts with /api/admin/
@RequestMapping("/api/admin/settings")
public class ClinicSettingController {

    private final ClinicSettingsService clinicSettingsService;

    @GetMapping
    public ResponseEntity<ClinicSettingsDTO> getClinicSetting(){
        return ResponseEntity.ok(clinicSettingsService.getClinicSettings());
    }

    @PutMapping
    public ResponseEntity<ClinicSettingsDTO> updateClinicSetting(@RequestBody ClinicSettingsDTO settingsDTO){
        return ResponseEntity.ok(clinicSettingsService.updateClinicSettings(settingsDTO));
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<HolidayDTO>> getAllHoliday(){
        return ResponseEntity.ok(clinicSettingsService.getAllHolidays());
    }

    @PostMapping("/holidays")
    public ResponseEntity<HolidayDTO> addHoliday(@RequestBody HolidayDTO holidayDTO){
        HolidayDTO newHoliday = clinicSettingsService.addHoliday(holidayDTO);
        return new ResponseEntity<>(newHoliday, HttpStatus.CREATED);
    }

    @DeleteMapping("/holidays/{holidayId}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long holidayId){
        clinicSettingsService.deleteHoliday(holidayId);
        return ResponseEntity.noContent().build();
    }
}
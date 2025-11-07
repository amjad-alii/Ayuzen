package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.entities.Appointment;
import com.Ayuzen.Ayuzen.entities.DoctorAvailabilityRule;
import com.Ayuzen.Ayuzen.entities.DoctorTimeBlock;
import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
import com.Ayuzen.Ayuzen.repository.DoctorAvailabilityRuleRepository;
import com.Ayuzen.Ayuzen.repository.DoctorTimeBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    @Autowired
    private DoctorAvailabilityRuleRepository ruleRepository;
    @Autowired
    private DoctorTimeBlockRepository blockRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    // Define the standard slot duration (e.g., 30 minutes)
    private static final int SLOT_DURATION_MINUTES = 30;

    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<LocalDateTime> allPossibleSlots = new ArrayList<>();

        // 1. Find the doctor's standard rules for that day of the week
        List<DoctorAvailabilityRule> rules = ruleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);
        if (rules.isEmpty()) {
            return allPossibleSlots; // Doctor does not work on this day
        }

        // 2. Generate all potential slots based on the rules
        for (DoctorAvailabilityRule rule : rules) {
            LocalTime slotTime = rule.getStartTime();
            while (slotTime.isBefore(rule.getEndTime())) {
                allPossibleSlots.add(LocalDateTime.of(date, slotTime));
                slotTime = slotTime.plusMinutes(SLOT_DURATION_MINUTES);
            }
        }

        // 3. Get all specific time blocks (vacations, etc.) for that doctor
        List<DoctorTimeBlock> timeBlocks = blockRepository.findByDoctorIdAndDateRange(doctorId, date.atStartOfDay(), date.atTime(LocalTime.MAX));

        // 4. Get all existing confirmed appointments for that doctor on that day
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndDateRange(doctorId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        Set<LocalDateTime> bookedSlots = existingAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .collect(Collectors.toSet());

        // 5. Filter the potential slots
        List<LocalDateTime> availableSlots = allPossibleSlots.stream()
                .filter(slot -> {
                    // Remove slots that are already booked
                    if (bookedSlots.contains(slot)) {
                        return false;
                    }

                    // Remove slots that fall within a time block
                    for (DoctorTimeBlock block : timeBlocks) {
                        if (!slot.isBefore(block.getStartTime()) && slot.isBefore(block.getEndTime())) {
                            return false; // Slot is inside a block, remove it
                        }
                    }

                    return true; // The slot is available
                })
                .collect(Collectors.toList());

        return availableSlots;
    }
}
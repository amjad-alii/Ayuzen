package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.DoctorAvailabilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface DoctorAvailabilityRuleRepository extends JpaRepository<DoctorAvailabilityRule, Long> {
    List<DoctorAvailabilityRule> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId); // Helper to clear rules before setting new ones
    List<DoctorAvailabilityRule> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek);
}

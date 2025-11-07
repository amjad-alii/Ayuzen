package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.DoctorTimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DoctorTimeBlockRepository extends JpaRepository<DoctorTimeBlock, Long> {
    List<DoctorTimeBlock> findByDoctorId(Long doctorId);

    @Query("SELECT b FROM DoctorTimeBlock b WHERE b.doctor.id = :doctorId AND b.startTime < :endOfDay AND b.endTime > :startOfDay")
    List<DoctorTimeBlock> findByDoctorIdAndDateRange(
            @Param("doctorId") Long doctorId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}
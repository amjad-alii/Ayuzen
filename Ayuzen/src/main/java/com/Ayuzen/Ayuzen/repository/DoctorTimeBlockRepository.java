package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.DoctorTimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorTimeBlockRepository extends JpaRepository<DoctorTimeBlock, Long> {
    List<DoctorTimeBlock> findByDoctorId(Long doctorId);
}
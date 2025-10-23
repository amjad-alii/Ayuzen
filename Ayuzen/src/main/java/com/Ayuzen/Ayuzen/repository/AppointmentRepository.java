package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);


    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDateTime >= :startOfDay AND a.appointmentDateTime < :endOfDay")
    long countByAppointmentDateTimeBetween(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT SUM(d.fee) FROM Appointment a JOIN a.doctor d WHERE a.appointmentDateTime >= :startOfDay AND a.appointmentDateTime < :endOfDay AND a.status = 'CONFIRMED'")
    Double findTotalRevenueForDay(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByUserIdAndDoctorId(Long userId, Long doctorId);
}

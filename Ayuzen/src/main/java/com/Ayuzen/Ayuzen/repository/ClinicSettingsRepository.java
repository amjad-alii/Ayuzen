package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.ClinicSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicSettingsRepository extends JpaRepository<ClinicSettings, Long> {
}

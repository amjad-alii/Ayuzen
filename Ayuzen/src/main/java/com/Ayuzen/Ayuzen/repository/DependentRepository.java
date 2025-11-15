package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Dependent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DependentRepository extends JpaRepository<Dependent, Long> {
    // Find all dependents associated with a main user's ID
    List<Dependent> findByUserId(Long userId);
}
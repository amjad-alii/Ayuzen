package com.Ayuzen.Ayuzen.repository;

import com.Ayuzen.Ayuzen.entities.Role;
import com.Ayuzen.Ayuzen.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    List<User> findAllByRole(Role role);
}

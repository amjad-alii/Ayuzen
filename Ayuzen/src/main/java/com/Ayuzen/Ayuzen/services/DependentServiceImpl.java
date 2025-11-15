package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DependentDTO;
import com.Ayuzen.Ayuzen.entities.Dependent;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.DependentRepository;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DependentServiceImpl implements DependentService {

    @Autowired private UserRepository userRepository;
    @Autowired private DependentRepository dependentRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public List<DependentDTO> getMyDependents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dependentRepository.findByUserId(user.getId()).stream()
                .map(dependent -> modelMapper.map(dependent, DependentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DependentDTO addDependent(String userEmail, DependentDTO dependentDTO) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dependent dependent = modelMapper.map(dependentDTO, Dependent.class);
        dependent.setUser(user); // Link this dependent to the logged-in user

        Dependent savedDependent = dependentRepository.save(dependent);
        return modelMapper.map(savedDependent, DependentDTO.class);
    }

    @Override
    @Transactional
    public void deleteDependent(String userEmail, Long dependentId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dependent dependent = dependentRepository.findById(dependentId)
                .orElseThrow(() -> new RuntimeException("Dependent not found"));

        // Security check: Make sure the person deleting this dependent is the owner
        if (!dependent.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this dependent.");
        }

        dependentRepository.delete(dependent);
    }
}

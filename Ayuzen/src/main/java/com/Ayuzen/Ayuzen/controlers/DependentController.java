package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.DependentDTO;
import com.Ayuzen.Ayuzen.services.DependentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/dependents")
@PreAuthorize("hasAuthority('ROLE_PATIENT')")
public class DependentController {

    @Autowired
    private DependentService dependentService;

    @GetMapping
    public ResponseEntity<List<DependentDTO>> getMyDependents(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(dependentService.getMyDependents(userEmail));
    }

    @PostMapping
    public ResponseEntity<DependentDTO> addDependent(@RequestBody DependentDTO dependentDTO, Authentication authentication) {
        String userEmail = authentication.getName();
        DependentDTO newDependent = dependentService.addDependent(userEmail, dependentDTO);
        return new ResponseEntity<>(newDependent, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDependent(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        dependentService.deleteDependent(userEmail, id);
        return ResponseEntity.noContent().build();
    }
}

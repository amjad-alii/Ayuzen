package com.Ayuzen.Ayuzen.services;

import com.Ayuzen.Ayuzen.dto.DependentDTO;
import java.util.List;

public interface DependentService {
    List<DependentDTO> getMyDependents(String userEmail);
    DependentDTO addDependent(String userEmail, DependentDTO dependentDTO);
    void deleteDependent(String userEmail, Long dependentId);
}

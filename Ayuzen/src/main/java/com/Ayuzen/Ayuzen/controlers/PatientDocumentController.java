package com.Ayuzen.Ayuzen.controlers;

import com.Ayuzen.Ayuzen.dto.PatientDocumentDTO;
import com.Ayuzen.Ayuzen.entities.PatientDocument;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.PatientDocumentRepository;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import com.Ayuzen.Ayuzen.services.StorageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient/documents")
public class PatientDocumentController {

    @Autowired private StorageService storageService;
    @Autowired private UserRepository userRepository;
    @Autowired private PatientDocumentRepository documentRepository;
    @Autowired private ModelMapper modelMapper;

    // Endpoint to upload a new document
    @PostMapping("/upload")
    public ResponseEntity<PatientDocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            User user = userRepository.findByEmail(authentication.getName()).get();

            // 1. Upload file to Firebase
            String fileUrl = storageService.uploadFile(file, user.getEmail());

            // 2. Save metadata to MySQL
            PatientDocument doc = new PatientDocument();
            doc.setUser(user);
            doc.setFileName(file.getOriginalFilename());
            doc.setFileType(file.getContentType());
            doc.setFileUrl(fileUrl);

            PatientDocument savedDoc = documentRepository.save(doc);

            return new ResponseEntity<>(modelMapper.map(savedDoc, PatientDocumentDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get all of the user's documents
    @GetMapping
    public ResponseEntity<List<PatientDocumentDTO>> getMyDocuments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        List<PatientDocumentDTO> documents = documentRepository.findByUserId(user.getId())
                .stream()
                .map(doc -> modelMapper.map(doc, PatientDocumentDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(documents);
    }
}

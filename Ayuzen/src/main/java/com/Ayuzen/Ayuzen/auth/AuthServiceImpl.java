package com.Ayuzen.Ayuzen.auth;

import com.Ayuzen.Ayuzen.dto.LoginDTO;
import com.Ayuzen.Ayuzen.dto.SignUpDTO;
import com.Ayuzen.Ayuzen.dto.UserDTO;
import com.Ayuzen.Ayuzen.entities.Doctor;
import com.Ayuzen.Ayuzen.entities.Role;
import com.Ayuzen.Ayuzen.entities.User;
import com.Ayuzen.Ayuzen.repository.DoctorRepository;
import com.Ayuzen.Ayuzen.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public UserDTO signUp(SignUpDTO signUpDTO) {
        if (userRepository.findByEmail(signUpDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already in use.");
        }
        User user = new User();
        user.setFullName(signUpDTO.getFullName());
        user.setEmail(signUpDTO.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));
        user.setPhone(signUpDTO.getPhone());
        user.setGender(signUpDTO.getGender());
        user.setAge(signUpDTO.getAge());
        user.setRole(signUpDTO.getRole());
        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.ROLE_DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setName(savedUser.getFullName());
            doctor.setEmail(savedUser.getEmail());
            doctor.setContactNumber(savedUser.getPhone());
            doctor.setSpecialty(signUpDTO.getSpecialty());
            doctor.setQualification(signUpDTO.getQualification());
            doctor.setExperience(signUpDTO.getExperience());
            doctor.setLocation(signUpDTO.getLocation());
            doctor.setRating(0.0);
            doctor.setImageUrl("https://cdn.jsdelivr.net/gh/AmjadAli9/assets/doctor-avatar.svg");
            doctor.setUser(savedUser);
            doctorRepository.save(doctor);
        }
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public String login(LoginDTO loginDTO) {
        // This validates the user's credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        // If authentication is successful, fetch the full User entity
        final User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        // Fetch the UserDetails object which contains the user's roles (authorities)
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // THIS IS THE FIX: Pass both the 'user' and 'userDetails' objects
        return jwtUtil.generateToken(user, userDetails);
    }
}
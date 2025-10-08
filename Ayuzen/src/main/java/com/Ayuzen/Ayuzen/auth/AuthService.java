package com.Ayuzen.Ayuzen.auth;

import com.Ayuzen.Ayuzen.dto.LoginDTO;
import com.Ayuzen.Ayuzen.dto.SignUpDTO;
import com.Ayuzen.Ayuzen.dto.UserDTO;

public interface AuthService {
    UserDTO signUp(SignUpDTO signUpDTO);
    String login(LoginDTO loginDTO);
}
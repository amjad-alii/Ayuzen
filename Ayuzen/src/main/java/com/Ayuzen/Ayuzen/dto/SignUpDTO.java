package com.Ayuzen.Ayuzen.dto;

import com.Ayuzen.Ayuzen.entities.Role;
import lombok.Data;

@Data // A shortcut for @Getter, @Setter, @ToString, @EqualsAndHashCode
public class SignUpDTO {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String gender;
    private int age;
    private Role role;
    private String specialty;
    private String qualification;
    private Integer experience;
    private String location;

    }


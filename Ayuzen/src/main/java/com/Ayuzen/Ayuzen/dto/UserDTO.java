package com.Ayuzen.Ayuzen.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private int age;
}


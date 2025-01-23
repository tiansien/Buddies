package com.example.backend.dtos.password;

import lombok.Data;

@Data
public class PasswordResetDto {

    private String email;
    private String code;
    private String newPassword;

}

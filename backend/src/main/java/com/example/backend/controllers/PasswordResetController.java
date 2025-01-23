package com.example.backend.controllers;

import com.example.backend.dtos.password.PasswordResetDto;
import com.example.backend.dtos.password.PasswordResetRequestDto;
import com.example.backend.services.PasswordResetService;
import com.example.backend.services.UserService;
import com.example.backend.services.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final EmailService emailService;
    private final UserService userService;

    @PostMapping("/forgot")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequestDto request) {
        try {
            String resetCode = passwordResetService.generateResetCode(request.getEmail());

            String htmlBody = String.format("""
                <html>
                    <body>
                        <h2>Password Reset Request</h2>
                        <p>Your password reset code is: <strong>%s</strong></p>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </body>
                </html>
                """, resetCode);

            emailService.sendHtmlEmail(
                    request.getEmail(),
                    "Password Reset Request",
                    htmlBody
            );

            return ResponseEntity.ok().body(Map.of("message", "Reset code sent to email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process reset request: " + e.getMessage()));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto resetRequest) {
        try {
            if (!passwordResetService.verifyResetCode(resetRequest.getEmail(), resetRequest.getCode())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset code"));
            }

            userService.updatePassword(resetRequest.getEmail(), resetRequest.getNewPassword());

            return ResponseEntity.ok().body(Map.of("message", "Password successfully reset"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


package com.example.backend.services;

import com.example.backend.entities.PasswordResetToken;
import com.example.backend.exceptions.AppException;
import com.example.backend.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private static final int EXPIRATION_MINUTES = 15;

    public String generateResetCode(String email) {
        // Generate a random 6-digit code
        String resetCode = String.format("%06d", new Random().nextInt(999999));

        // Create new token entity
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setToken(resetCode);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        token.setUsed(false);

        // Save to database
        tokenRepository.save(token);

        return resetCode;
    }

    @Transactional
    public boolean verifyResetCode(String email, String code) {
        PasswordResetToken token = tokenRepository
                .findByEmailAndTokenAndUsedFalse(email, code)
                .orElseThrow(() -> new AppException("Invalid or expired reset code", HttpStatus.BAD_REQUEST));

        if (token.isExpired()) {
            throw new AppException("Reset code has expired", HttpStatus.BAD_REQUEST);
        }

        // Mark token as used
        token.setUsed(true);
        tokenRepository.save(token);

        return true;
    }
}

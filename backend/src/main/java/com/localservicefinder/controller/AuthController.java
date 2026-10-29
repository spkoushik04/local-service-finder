package com.localservicefinder.controller;

import com.localservicefinder.dto.*;
import com.localservicefinder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST Controller.
 * Handles customer and provider registrations and role-based login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Customer Registration: POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerCustomer(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.registerCustomer(request);
        return new ResponseEntity<>(
                ApiResponse.success("Customer registered successfully!", user),
                HttpStatus.CREATED
        );
    }

    /**
     * Service Provider Registration: POST /api/auth/register-provider
     */
    @PostMapping("/register-provider")
    public ResponseEntity<ApiResponse<UserResponse>> registerProvider(@Valid @RequestBody ProviderRegisterRequest request) {
        UserResponse user = authService.registerProvider(request);
        return new ResponseEntity<>(
                ApiResponse.success("Provider registered successfully! Your account is pending admin approval.", user),
                HttpStatus.CREATED
        );
    }

    /**
     * User Login: POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@Valid @RequestBody LoginRequest request) {
        UserResponse user = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", user));
    }
}

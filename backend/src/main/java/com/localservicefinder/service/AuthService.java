package com.localservicefinder.service;

import com.localservicefinder.dto.LoginRequest;
import com.localservicefinder.dto.ProviderRegisterRequest;
import com.localservicefinder.dto.RegisterRequest;
import com.localservicefinder.dto.UserResponse;
import com.localservicefinder.entity.*;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ServiceCategoryRepository;
import com.localservicefinder.repository.ServiceProviderRepository;
import com.localservicefinder.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       ServiceCategoryRepository categoryRepository,
                       ServiceProviderRepository providerRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.providerRepository = providerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse registerCustomer(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new BadRequestException("Email is already registered. Please login.");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setCity(request.getCity().trim());
        user.setAddress(request.getAddress().trim());

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser, null);
    }

    @Transactional
    public UserResponse registerProvider(ProviderRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new BadRequestException("Email is already registered. Please login.");
        }

        ServiceCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected service category not found"));

        // 1. Create base User record with PROVIDER role
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.PROVIDER);
        user.setCity(request.getCity().trim());
        user.setAddress(request.getAddress().trim());
        User savedUser = userRepository.save(user);

        // 2. Create ServiceProvider record with status PENDING
        ServiceProvider provider = new ServiceProvider();
        provider.setUser(savedUser);
        provider.setCategory(category);
        provider.setBusinessName(request.getBusinessName().trim());
        provider.setExperience(request.getExperience());
        provider.setDescription(request.getDescription());
        provider.setStartingPrice(request.getStartingPrice());
        provider.setCity(request.getCity().trim());
        provider.setAddress(request.getAddress().trim());
        provider.setWorkingHours(request.getWorkingHours() != null ? request.getWorkingHours() : "9:00 AM - 7:00 PM");
        provider.setAvailability("Available Today");
        provider.setVerified(false);
        provider.setStatus(ProviderStatus.PENDING);
        provider.setRating(0.0);

        ServiceProvider savedProvider = providerRepository.save(provider);
        return mapToUserResponse(savedUser, savedProvider);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        ServiceProvider provider = null;
        if (user.getRole() == Role.PROVIDER) {
            Optional<ServiceProvider> provOpt = providerRepository.findByUserId(user.getId());
            if (provOpt.isPresent()) {
                provider = provOpt.get();
            }
        }

        return mapToUserResponse(user, provider);
    }

    public UserResponse mapToUserResponse(User user, ServiceProvider provider) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setCity(user.getCity());
        response.setAddress(user.getAddress());
        response.setCreatedAt(user.getCreatedAt());

        if (provider != null) {
            response.setProviderId(provider.getId());
            response.setProviderStatus(provider.getStatus().name());
        } else if (user.getRole() == Role.PROVIDER) {
            providerRepository.findByUserId(user.getId()).ifPresent(p -> {
                response.setProviderId(p.getId());
                response.setProviderStatus(p.getStatus().name());
            });
        }

        return response;
    }
}

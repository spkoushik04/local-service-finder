package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.ProviderResponseDto;
import com.localservicefinder.dto.ServiceRequestDto;
import com.localservicefinder.entity.Service;
import com.localservicefinder.entity.ServiceCategory;
import com.localservicefinder.entity.ServiceProvider;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ServiceCategoryRepository;
import com.localservicefinder.repository.ServiceProviderRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.service.ServiceProviderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service Provider REST Controller:
 * GET /api/providers
 * GET /api/providers/{id}
 * GET /api/providers/search
 * POST /api/providers/{providerId}/services
 * PUT /api/providers/{id}
 */
@RestController
@RequestMapping("/api/providers")
public class ServiceProviderController {

    private final ServiceProviderService providerService;
    private final ServiceProviderRepository providerRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;

    public ServiceProviderController(ServiceProviderService providerService,
                                     ServiceProviderRepository providerRepository,
                                     ServiceCategoryRepository categoryRepository,
                                     ServiceRepository serviceRepository) {
        this.providerService = providerService;
        this.providerRepository = providerRepository;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> getAllProviders() {
        List<ProviderResponseDto> providers = providerService.getAllApprovedProviders();
        return ResponseEntity.ok(ApiResponse.success("Providers fetched successfully", providers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> getProviderById(@PathVariable Long id) {
        ProviderResponseDto provider = providerService.getProviderDtoById(id);
        return ResponseEntity.ok(ApiResponse.success("Provider fetched successfully", provider));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProviderResponseDto>>> searchProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "rating_desc") String sortBy) {

        List<ProviderResponseDto> results = providerService.searchProviders(categoryId, category, city, minRating, maxPrice, sortBy);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved", results));
    }

    @PostMapping("/{providerId}/services")
    public ResponseEntity<ApiResponse<Service>> addServiceForProvider(
            @PathVariable Long providerId,
            @Valid @RequestBody ServiceRequestDto dto) {

        ServiceProvider provider = providerService.getProviderEntityById(providerId);
        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Service service = new Service();
        service.setProvider(provider);
        service.setCategory(category);
        service.setServiceName(dto.getServiceName().trim());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());

        Service saved = serviceRepository.save(service);
        return new ResponseEntity<>(ApiResponse.success("Service added successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderResponseDto>> updateProvider(
            @PathVariable Long id,
            @RequestBody ProviderResponseDto dto) {

        ServiceProvider provider = providerService.getProviderEntityById(id);
        if (dto.getBusinessName() != null) provider.setBusinessName(dto.getBusinessName());
        if (dto.getExperience() != null) provider.setExperience(dto.getExperience());
        if (dto.getDescription() != null) provider.setDescription(dto.getDescription());
        if (dto.getStartingPrice() != null) provider.setStartingPrice(dto.getStartingPrice());
        if (dto.getCity() != null) provider.setCity(dto.getCity());
        if (dto.getAddress() != null) provider.setAddress(dto.getAddress());
        if (dto.getWorkingHours() != null) provider.setWorkingHours(dto.getWorkingHours());
        if (dto.getAvailability() != null) provider.setAvailability(dto.getAvailability());

        ServiceProvider updated = providerRepository.save(provider);
        return ResponseEntity.ok(ApiResponse.success("Provider profile updated", providerService.toDto(updated)));
    }
}

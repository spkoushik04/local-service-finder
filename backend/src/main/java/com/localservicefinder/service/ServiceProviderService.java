package com.localservicefinder.service;

import com.localservicefinder.dto.ProviderResponseDto;
import com.localservicefinder.entity.ProviderStatus;
import com.localservicefinder.entity.ServiceProvider;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.ReviewRepository;
import com.localservicefinder.repository.ServiceProviderRepository;
import com.localservicefinder.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceProviderService {

    private final ServiceProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;

    public ServiceProviderService(ServiceProviderRepository providerRepository,
                                  ServiceRepository serviceRepository,
                                  ReviewRepository reviewRepository) {
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ProviderResponseDto> getAllApprovedProviders() {
        return providerRepository.findByStatus(ProviderStatus.APPROVED)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProviderResponseDto getProviderDtoById(Long id) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        return toDto(provider);
    }

    public ServiceProvider getProviderEntityById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
    }

    public List<ProviderResponseDto> searchProviders(Long categoryId, String categoryName, String city,
                                                    Double minRating, BigDecimal maxPrice, String sortBy) {
        // Clean parameters
        String searchCategory = (categoryName != null && !categoryName.trim().isEmpty()) ? categoryName.trim() : null;
        String searchCity = (city != null && !city.trim().isEmpty()) ? city.trim() : null;

        List<ServiceProvider> list = providerRepository.searchProviders(
                ProviderStatus.APPROVED,
                categoryId,
                searchCategory,
                searchCity,
                minRating,
                maxPrice
        );

        List<ProviderResponseDto> dtoList = list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        // Sort if requested
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ProviderResponseDto::getStartingPrice));
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ProviderResponseDto::getStartingPrice).reversed());
        } else if ("rating_desc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ProviderResponseDto::getRating).reversed());
        } else if ("experience_desc".equalsIgnoreCase(sortBy)) {
            dtoList.sort(Comparator.comparing(ProviderResponseDto::getExperience).reversed());
        }

        return dtoList;
    }

    public ProviderResponseDto toDto(ServiceProvider provider) {
        ProviderResponseDto dto = new ProviderResponseDto();
        dto.setId(provider.getId());

        if (provider.getUser() != null) {
            dto.setUserId(provider.getUser().getId());
            dto.setName(provider.getUser().getName());
            dto.setEmail(provider.getUser().getEmail());
            dto.setPhone(provider.getUser().getPhone());
        }

        dto.setBusinessName(provider.getBusinessName());

        if (provider.getCategory() != null) {
            dto.setCategoryId(provider.getCategory().getId());
            dto.setCategoryName(provider.getCategory().getName());
            dto.setCategoryIcon(provider.getCategory().getIcon());
        }

        dto.setExperience(provider.getExperience());
        dto.setDescription(provider.getDescription());
        dto.setStartingPrice(provider.getStartingPrice());
        dto.setCity(provider.getCity());
        dto.setAddress(provider.getAddress());
        dto.setWorkingHours(provider.getWorkingHours());
        dto.setAvailability(provider.getAvailability());
        dto.setVerified(provider.getVerified());
        dto.setStatus(provider.getStatus());
        dto.setRating(provider.getRating());
        dto.setCreatedAt(provider.getCreatedAt());

        long revCount = reviewRepository.countByProviderId(provider.getId());
        dto.setReviewsCount(revCount);

        dto.setServices(serviceRepository.findByProviderId(provider.getId()));
        return dto;
    }
}

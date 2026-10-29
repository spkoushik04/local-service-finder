package com.localservicefinder.service;

import com.localservicefinder.dto.DashboardStatsDto;
import com.localservicefinder.dto.ProviderResponseDto;
import com.localservicefinder.entity.BookingStatus;
import com.localservicefinder.entity.ProviderStatus;
import com.localservicefinder.entity.ServiceProvider;
import com.localservicefinder.entity.User;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceProviderRepository providerRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final ServiceProviderService providerService;

    public AdminService(UserRepository userRepository,
                        ServiceProviderRepository providerRepository,
                        ServiceCategoryRepository categoryRepository,
                        ServiceRepository serviceRepository,
                        BookingRepository bookingRepository,
                        ReviewRepository reviewRepository,
                        ServiceProviderService providerService) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.providerService = providerService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public List<ProviderResponseDto> getAllProviders() {
        return providerRepository.findAll()
                .stream()
                .map(providerService::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProviderResponseDto approveProvider(Long id) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        provider.setStatus(ProviderStatus.APPROVED);
        provider.setVerified(true);
        ServiceProvider saved = providerRepository.save(provider);
        return providerService.toDto(saved);
    }

    @Transactional
    public ProviderResponseDto rejectProvider(Long id) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        provider.setStatus(ProviderStatus.REJECTED);
        ServiceProvider saved = providerRepository.save(provider);
        return providerService.toDto(saved);
    }

    public DashboardStatsDto getAdminStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProviders(providerRepository.count());
        stats.setTotalServices(serviceRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingApprovals(providerRepository.countByStatus(ProviderStatus.PENDING));
        stats.setCompletedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED));
        return stats;
    }

    public DashboardStatsDto getCustomerStats(Long customerId) {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalBookings(bookingRepository.countByCustomerId(customerId));
        stats.setPendingBookings(bookingRepository.countByCustomerIdAndStatus(customerId, BookingStatus.PENDING));
        stats.setAcceptedBookings(bookingRepository.countByCustomerIdAndStatus(customerId, BookingStatus.ACCEPTED));
        stats.setCompletedBookings(bookingRepository.countByCustomerIdAndStatus(customerId, BookingStatus.COMPLETED));
        stats.setCancelledBookings(bookingRepository.countByCustomerIdAndStatus(customerId, BookingStatus.CANCELLED));
        return stats;
    }

    public DashboardStatsDto getProviderStats(Long providerId) {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalBookings(bookingRepository.countByProviderId(providerId));
        stats.setPendingBookings(bookingRepository.countByProviderIdAndStatus(providerId, BookingStatus.PENDING));
        stats.setAcceptedBookings(bookingRepository.countByProviderIdAndStatus(providerId, BookingStatus.ACCEPTED));
        stats.setCompletedBookings(bookingRepository.countByProviderIdAndStatus(providerId, BookingStatus.COMPLETED));

        Double avg = reviewRepository.findAverageRatingByProviderId(providerId);
        stats.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        return stats;
    }
}

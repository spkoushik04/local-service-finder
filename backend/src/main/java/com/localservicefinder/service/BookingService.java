package com.localservicefinder.service;

import com.localservicefinder.dto.BookingRequest;
import com.localservicefinder.entity.*;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ServiceProviderRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ServiceProviderRepository providerRepository,
                          ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        ServiceProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + request.getProviderId()));

        com.localservicefinder.entity.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with id: " + request.getServiceId()));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setService(service);
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setAddress(request.getAddress());
        booking.setDescription(request.getDescription());
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getBookingsByProvider(Long providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }
}

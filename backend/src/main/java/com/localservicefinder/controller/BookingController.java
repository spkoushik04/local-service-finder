package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.BookingRequest;
import com.localservicefinder.dto.BookingStatusUpdateRequest;
import com.localservicefinder.entity.Booking;
import com.localservicefinder.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking REST Controller:
 * POST /api/bookings
 * GET /api/bookings/{id}
 * GET /api/bookings/customer/{customerId}
 * GET /api/bookings/provider/{providerId}
 * PUT /api/bookings/{id}/status
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return new ResponseEntity<>(
                ApiResponse.success("Your service request has been submitted successfully.", booking),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<Booking> bookings = bookingService.getBookingsByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer bookings retrieved", bookings));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByProvider(@PathVariable Long providerId) {
        List<Booking> bookings = bookingService.getBookingsByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider bookings retrieved", bookings));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        Booking updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Booking status updated to " + request.getStatus(), updated));
    }
}

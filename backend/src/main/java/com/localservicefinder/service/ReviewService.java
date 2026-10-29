package com.localservicefinder.service;

import com.localservicefinder.dto.ReviewRequest;
import com.localservicefinder.entity.*;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.ResourceNotFoundException;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ReviewRepository;
import com.localservicefinder.repository.ServiceProviderRepository;
import com.localservicefinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository providerRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         UserRepository userRepository,
                         ServiceProviderRepository providerRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
    }

    @Transactional
    public Review createReview(ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("A review has already been submitted for this booking.");
        }

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        ServiceProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + request.getProviderId()));

        Review review = new Review();
        review.setBooking(booking);
        review.setCustomer(customer);
        review.setProvider(provider);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review savedReview = reviewRepository.save(review);

        // Recalculate average rating for provider
        Double avg = reviewRepository.findAverageRatingByProviderId(provider.getId());
        if (avg != null) {
            BigDecimal rounded = BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP);
            provider.setRating(rounded.doubleValue());
            providerRepository.save(provider);
        }

        return savedReview;
    }

    public List<Review> getReviewsByProvider(Long providerId) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }
}

package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.ReviewRequest;
import com.localservicefinder.entity.Review;
import com.localservicefinder.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Review REST Controller:
 * POST /api/reviews
 * GET /api/reviews/provider/{providerId}
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> createReview(@Valid @RequestBody ReviewRequest request) {
        Review review = reviewService.createReview(request);
        return new ResponseEntity<>(
                ApiResponse.success("Thank you! Your review has been submitted.", review),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByProvider(@PathVariable Long providerId) {
        List<Review> reviews = reviewService.getReviewsByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }
}

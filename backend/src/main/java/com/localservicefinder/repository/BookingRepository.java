package com.localservicefinder.repository;

import com.localservicefinder.entity.Booking;
import com.localservicefinder.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);

    long countByStatus(BookingStatus status);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(Long customerId, BookingStatus status);

    long countByProviderId(Long providerId);

    long countByProviderIdAndStatus(Long providerId, BookingStatus status);
}

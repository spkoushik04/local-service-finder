package com.localservicefinder.repository;

import com.localservicefinder.entity.ProviderStatus;
import com.localservicefinder.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    Optional<ServiceProvider> findByUserId(Long userId);

    List<ServiceProvider> findByStatus(ProviderStatus status);

    List<ServiceProvider> findByCategoryIdAndStatus(Long categoryId, ProviderStatus status);

    List<ServiceProvider> findByCityIgnoreCaseAndStatus(String city, ProviderStatus status);

    long countByStatus(ProviderStatus status);

    /**
     * Dynamic provider search query supporting optional category, city, minimum rating, and maximum price.
     */
    @Query("SELECT p FROM ServiceProvider p WHERE " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:categoryName IS NULL OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))) AND " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:maxPrice IS NULL OR p.startingPrice <= :maxPrice)")
    List<ServiceProvider> searchProviders(
            @Param("status") ProviderStatus status,
            @Param("categoryId") Long categoryId,
            @Param("categoryName") String categoryName,
            @Param("city") String city,
            @Param("minRating") Double minRating,
            @Param("maxPrice") BigDecimal maxPrice
    );
}

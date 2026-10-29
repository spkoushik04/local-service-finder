package com.localservicefinder.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Service Provider Entity.
 * Linked 1:1 with User, and N:1 with ServiceCategory.
 */
@Entity
@Table(name = "service_providers")
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(name = "business_name", nullable = false, length = 25)
    private String businessName;

    @Column(nullable = false)
    private Integer experience = 1;

    @Column(length = 200)
    private String description;

    @Column(name = "starting_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal startingPrice = new BigDecimal("199.00");

    @Column(nullable = false, length = 25)
    private String city;

    @Column(nullable = false, length = 50)
    private String address;

    @Column(name = "working_hours", length = 25)
    private String workingHours = "9:00 AM - 7:00 PM";

    @Column(length = 25)
    private String availability = "Available Today";

    @Column(nullable = false)
    private Boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProviderStatus status = ProviderStatus.PENDING;

    @Column
    private Double rating = 0.0;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ServiceProvider() {
    }

    public ServiceProvider(User user, ServiceCategory category, String businessName, Integer experience,
                           String description, BigDecimal startingPrice, String city, String address,
                           String workingHours, String availability, Boolean verified, ProviderStatus status, Double rating) {
        this.user = user;
        this.category = category;
        this.businessName = businessName;
        this.experience = experience;
        this.description = description;
        this.startingPrice = startingPrice;
        this.city = city;
        this.address = address;
        this.workingHours = workingHours;
        this.availability = availability;
        this.verified = verified;
        this.status = status;
        this.rating = rating;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public ProviderStatus getStatus() {
        return status;
    }

    public void setStatus(ProviderStatus status) {
        this.status = status;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

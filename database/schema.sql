-- ========================================================================
-- Local Service Finder Database Schema
-- Database: local_service_finder
-- Architecture: HTML/CSS/JS -> Spring Boot REST API -> MySQL
-- ========================================================================

CREATE DATABASE IF NOT EXISTS local_service_finder
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE local_service_finder;

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_providers;
DROP TABLE IF EXISTS service_categories;
DROP TABLE IF EXISTS users;

-- ========================================================================
-- 1. USERS TABLE
-- Roles: CUSTOMER, PROVIDER, ADMIN
-- ========================================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(18) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(15) NOT NULL,
    role ENUM('CUSTOMER', 'PROVIDER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    city VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================================================
-- 2. SERVICE CATEGORIES TABLE
-- ========================================================================
CREATE TABLE service_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================================================
-- 3. SERVICE PROVIDERS TABLE
-- 1-to-1 with Users, N-to-1 with Service Categories
-- Status: PENDING, APPROVED, REJECTED
-- ========================================================================
CREATE TABLE service_providers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT(25) NOT NULL UNIQUE,
    category_id BIGINT(25) NOT NULL,
    business_name VARCHAR(25) NOT NULL,
    experience INT NOT NULL DEFAULT 1,
    description VARCHAR(200),
    starting_price DECIMAL(10, 2) NOT NULL DEFAULT 199.00,
    city VARCHAR(25) NOT NULL,
    address VARCHAR(50) NOT NULL,
    working_hours VARCHAR(25) DEFAULT '9:00 AM - 7:00 PM',
    availability VARCHAR(25) DEFAULT 'Available Today',
    verified BOOLEAN DEFAULT FALSE,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_provider_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_provider_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ========================================================================
-- 4. SERVICES TABLE
-- Individual services offered by a service provider
-- ========================================================================
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    service_name VARCHAR(40) NOT NULL,
    description VARCHAR(200),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_provider FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_service_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ========================================================================
-- 5. BOOKINGS TABLE
-- Customer booking a specific provider and service
-- Status: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
-- ========================================================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(20) NOT NULL,
    address VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_provider FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================================================================
-- 6. REVIEWS TABLE
-- 1-to-1 with Booking, N-to-1 with Customer & Provider
-- ========================================================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_provider FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX idx_providers_city ON service_providers(city);
CREATE INDEX idx_providers_status ON service_providers(status);
CREATE INDEX idx_providers_rating ON service_providers(rating);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);

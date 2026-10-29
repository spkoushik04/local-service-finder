-- ========================================================================
-- Migration Script: ALTER TABLE to update column sizes directly
-- Database: local_service_finder
-- Run this script in MySQL Workbench or MySQL Command Line to update
-- existing tables to the new column sizes instantly.
-- ========================================================================

USE local_service_finder;

-- 1. USERS TABLE
ALTER TABLE users 
    MODIFY name VARCHAR(18) NOT NULL,
    MODIFY email VARCHAR(30) NOT NULL,
    MODIFY phone VARCHAR(15) NOT NULL,
    MODIFY password VARCHAR(20) NOT NULL,
    MODIFY city VARCHAR(15) NOT NULL;

-- 2. SERVICE CATEGORIES TABLE
ALTER TABLE service_categories 
    MODIFY name VARCHAR(20) NOT NULL,
    MODIFY description VARCHAR(100) NOT NULL;

-- 3. SERVICE PROVIDERS TABLE
ALTER TABLE service_providers 
    MODIFY user_id BIGINT(25) NOT NULL,
    MODIFY category_id BIGINT(25) NOT NULL,
    MODIFY business_name VARCHAR(25) NOT NULL,
    MODIFY description VARCHAR(200),
    MODIFY city VARCHAR(25) NOT NULL,
    MODIFY address VARCHAR(50) NOT NULL,
    MODIFY working_hours VARCHAR(25) DEFAULT '9:00 AM - 7:00 PM',
    MODIFY availability VARCHAR(25) DEFAULT 'Available Today';

-- 4. SERVICES TABLE
ALTER TABLE services 
    MODIFY service_name VARCHAR(40) NOT NULL,
    MODIFY description VARCHAR(200);

-- 5. BOOKINGS TABLE
ALTER TABLE bookings 
    MODIFY booking_time VARCHAR(20) NOT NULL,
    MODIFY address VARCHAR(50) NOT NULL,
    MODIFY description VARCHAR(200);

-- 6. REVIEWS TABLE
ALTER TABLE reviews 
    MODIFY comment VARCHAR(200) NOT NULL;

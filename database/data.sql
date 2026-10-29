-- ========================================================================
-- Local Service Finder Sample Data
-- Database: local_service_finder
-- ========================================================================

USE local_service_finder;

-- Disable foreign key checks during batch seed
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE bookings;
TRUNCATE TABLE services;
TRUNCATE TABLE service_providers;
TRUNCATE TABLE service_categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================================
-- 1. USERS
-- Passwords: All accounts use 'password123', admin uses 'admin123'
-- BCrypt hashes:
-- 'admin123'    -> $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- 'password123' -> $2a$10$7R9r.Qx1K2jS3l4m5n6o7ep8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e
-- (Spring DataInitializer also checks and re-hashes if plain text or seeds automatically)
-- ========================================================================
INSERT INTO users (id, name, email, phone, password, role, city, address) VALUES
(1, 'Koushik S P', 'koushik@gmail.com', '9876543210', 'hitman45', 'ADMIN', 'Chennai', 'HQ Anna Salai, T Nagar, Chennai'),
(2, 'Rahul Sharma', 'rahul@example.com', '9840123456', 'password123', 'CUSTOMER', 'Chennai', 'Flat 4B, Emerald Court, Velachery, Chennai'),
(3, 'Priya Sundaram', 'priya@example.com', '9840987654', 'password123', 'CUSTOMER', 'Bangalore', '12th Cross, Indiranagar, Bangalore'),
(4, 'Suresh Kumar', 'suresh@lsf.com', '9841122334', 'password123', 'PROVIDER', 'Chennai', '24, MGR Road, Kodambakkam, Chennai'),
(5, 'Murugan Selvam', 'murugan@lsf.com', '9841233445', 'password123', 'PROVIDER', 'Chennai', '56, South Usman Road, T Nagar, Chennai'),
(6, 'Ramesh Babu', 'ramesh@lsf.com', '9841344556', 'password123', 'PROVIDER', 'Bangalore', '89, Koramangala 4th Block, Bangalore'),
(7, 'Karthik Raja', 'karthik@lsf.com', '9841455667', 'password123', 'PROVIDER', 'Chennai', '15, 2nd Avenue, Anna Nagar, Chennai'),
(8, 'Anitha Lakshmi', 'anitha@lsf.com', '9841566778', 'password123', 'PROVIDER', 'Coimbatore', '102, DB Road, RS Puram, Coimbatore'),
(9, 'Vijay Anand', 'vijay@lsf.com', '9841677889', 'password123', 'PROVIDER', 'Hyderabad', 'Hitech City Main Rd, Madhapur, Hyderabad'),
(10, 'Deepa Mohan', 'deepa@lsf.com', '9841788990', 'password123', 'PROVIDER', 'Pondicherry', 'Mission Street, White Town, Pondicherry'),
(11, 'Arun Prakash', 'arun@lsf.com', '9841899001', 'password123', 'PROVIDER', 'Madurai', 'West Masi Street, Madurai'),
(12, 'Dinesh Kumar', 'dinesh@lsf.com', '9841999112', 'password123', 'PROVIDER', 'Chennai', '10, Mount Road, Guindy, Chennai'),
(13, 'Saravanan R', 'saravanan.driver@lsf.com', '9841888222', 'password123', 'PROVIDER', 'Chennai', 'Velachery Main Road, Velachery, Chennai'),
(14, 'Vignesh Kumar', 'vignesh.bike@lsf.com', '9841777333', 'password123', 'PROVIDER', 'Chennai', '100 Feet Road, Vadapalani, Chennai'),
(15, 'Manikandan S', 'manikandan.car@lsf.com', '9841666444', 'password123', 'PROVIDER', 'Chennai', 'GST Road, Tambaram, Chennai'),
(16, 'Ganesh Moorthy', 'ganesh.solar@lsf.com', '9841555555', 'password123', 'PROVIDER', 'Chennai', 'OMR IT Corridor, Thoraipakkam, Chennai'),
(17, 'Barath S', 'barath@gmail.com', '9876543211', 'barath123', 'ADMIN', 'Chennai', 'HQ Anna Salai, T Nagar, Chennai');

-- ========================================================================
-- 2. SERVICE CATEGORIES
-- ========================================================================
INSERT INTO service_categories (id, name, description, icon) VALUES
(1, 'Plumbing', 'Pipe leaks, taps, sanitary fittings, water heater, and bathroom drainage.', 'fa-faucet-drip'),
(2, 'Electrical', 'Wiring repairs, switchboard replacements, MCB issues, fan fittings, and home electrical setup.', 'fa-bolt'),
(3, 'Carpentry', 'Custom wooden furniture, door repairs, modular kitchen cabinets, and lock replacements.', 'fa-hammer'),
(4, 'AC Repair', 'Air conditioner servicing, gas refilling, cooling issues, filter cleaning, and new AC installation.', 'fa-snowflake'),
(5, 'Home Cleaning', 'Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa shampooing.', 'fa-broom'),
(6, 'Painting', 'Interior/exterior wall painting, waterproof primer coats, texture design, and touch-up works.', 'fa-paint-roller'),
(7, 'Computer Repair', 'Laptop hardware fixes, motherboard chip repairs, Windows/Mac OS reinstallations, and data recovery.', 'fa-laptop-medical'),
(8, 'Vehicle Repair', 'Two-wheeler and four-wheeler on-demand roadside assist, oil change, brake tune-up, and servicing.', 'fa-wrench'),
(9, 'Beauty Services', 'Professional salon at home, hair styling, skin care, facials, waxing, and bridal grooming.', 'fa-spa'),
(10, 'Pest Control', 'Eco-friendly cockroach, termite, bed bug, rodent, and mosquito eradication treatments.', 'fa-bug'),
(11, 'Acting Driver', 'Professional call & acting drivers for local city trips, hourly hire, outstation journeys, and luxury cars.', 'fa-id-card'),
(12, 'Bike Mechanic', 'Doorstep two-wheeler servicing, oil change, engine tuning, tyre puncture, and roadside breakdown assistance.', 'fa-motorcycle'),
(13, 'Car Mechanic', 'Multi-brand car periodic maintenance, engine OBD diagnostics, brake overhaul, clutch repair, and breakdown towing.', 'fa-car'),
(14, 'Solar Panel', 'Rooftop solar installation, inverter & battery setup, deep solar panel cleaning, and efficiency maintenance.', 'fa-solar-panel');

-- ========================================================================
-- 3. SERVICE PROVIDERS
-- ========================================================================
INSERT INTO service_providers (id, user_id, category_id, business_name, experience, description, starting_price, city, address, working_hours, availability, verified, status, rating) VALUES
(1, 4, 2, 'Suresh Super Electricals', 8, 'Licensed government wireman with 8+ years expertise in residential and commercial electrical maintenance.', 299.00, 'Chennai', '24, MGR Road, Kodambakkam, Chennai', '8:00 AM - 8:00 PM', 'Available Today', TRUE, 'APPROVED', 4.8),
(2, 5, 1, 'Murugan Quick Plumbers', 11, 'Specialist in instant leakage plugging, pump motors, pipeline laying, and sanitary fixtures across Chennai.', 349.00, 'Chennai', '56, South Usman Road, T Nagar, Chennai', '7:00 AM - 9:00 PM', 'Available Today', TRUE, 'APPROVED', 4.9),
(3, 6, 3, 'Babu Artisan Carpentry', 6, 'Skilled carpentry services for custom furniture, wardrobe repair, lock changes, and modular kitchen fittings.', 399.00, 'Bangalore', '89, Koramangala 4th Block, Bangalore', '9:00 AM - 7:00 PM', 'Available Tomorrow', TRUE, 'APPROVED', 4.7),
(4, 7, 4, 'CoolTech AC Care', 7, 'Certified technician for split and inverter AC gas filling, compressor repair, jet chemical service.', 499.00, 'Chennai', '15, 2nd Avenue, Anna Nagar, Chennai', '8:30 AM - 8:30 PM', 'Available Today', TRUE, 'APPROVED', 4.9),
(5, 8, 5, 'SparklePro Cleaners', 5, 'Hospital-grade sanitized home deep cleaning, kitchen degreasing, bathroom scrubbing with mechanized tools.', 799.00, 'Coimbatore', '102, DB Road, RS Puram, Coimbatore', '9:00 AM - 6:00 PM', 'Available Today', TRUE, 'APPROVED', 4.6),
(6, 9, 7, 'CyberDoc PC Doctors', 9, 'Same-day doorstep laptop diagnosis, screen replacements, SSD upgrades, and Windows troubleshoot.', 350.00, 'Hyderabad', 'Hitech City Main Rd, Madhapur, Hyderabad', '10:00 AM - 9:00 PM', 'Available Today', TRUE, 'APPROVED', 4.8),
(7, 10, 9, 'Deepa Herbal Salon', 6, 'Hygienic salon treatments, organic herbal facials, bridal packages delivered with single-use kits.', 450.00, 'Pondicherry', 'Mission Street, White Town, Pondicherry', '10:00 AM - 7:00 PM', 'Available Tomorrow', TRUE, 'APPROVED', 4.9),
(8, 11, 6, 'Rainbow Palette Painting', 10, 'Experienced Asian Paints certified contractor offering interior, exterior, and waterproofing jobs.', 1200.00, 'Madurai', 'West Masi Street, Madurai', '8:00 AM - 6:00 PM', 'Available Today', TRUE, 'APPROVED', 4.5),
(9, 12, 1, 'Dinesh Express Plumbing', 3, 'Fresh local plumbing service awaiting initial verification.', 250.00, 'Chennai', '10, Mount Road, Guindy, Chennai', '9:00 AM - 7:00 PM', 'Available Today', FALSE, 'PENDING', 0.0),
(10, 13, 11, 'CityPro Acting Drivers', 10, 'Professional RTO verified acting drivers with 10+ years experience in manual & automatic luxury cars for city, night, and outstation trips.', 350.00, 'Chennai', 'Velachery Main Road, Velachery, Chennai', '24 Hours / On-Demand', 'Available Today', TRUE, 'APPROVED', 4.9),
(11, 14, 12, 'Speedy Two-Wheeler Garage', 8, 'Expert doorstep bike & scooter mechanics for Honda, Yamaha, Royal Enfield, and EV bikes. Quick breakdown & tyre fix.', 199.00, 'Chennai', '100 Feet Road, Vadapalani, Chennai', '8:00 AM - 9:00 PM', 'Available Today', TRUE, 'APPROVED', 4.8),
(12, 15, 13, 'Apex Auto Car Care', 12, 'Multi-brand car specialist offering doorstep periodic maintenance, computer OBD scanner diagnostics, clutch & brake overhauls.', 499.00, 'Chennai', 'GST Road, Tambaram, Chennai', '8:30 AM - 8:30 PM', 'Available Today', TRUE, 'APPROVED', 4.9),
(13, 16, 14, 'SunPower Solar Solutions', 7, 'MNRE certified solar rooftop technician specializing in on-grid/off-grid solar installation, inverter servicing, and eco-friendly panel wash.', 599.00, 'Chennai', 'OMR IT Corridor, Thoraipakkam, Chennai', '9:00 AM - 7:00 PM', 'Available Today', TRUE, 'APPROVED', 4.9);

-- ========================================================================
-- 4. SERVICES
-- ========================================================================
INSERT INTO services (id, provider_id, category_id, service_name, description, price) VALUES
(1, 1, 2, 'Ceiling Fan Installation & Repair', 'Unmounting, balancing, capacitor replacement or new fan installation.', 299.00),
(2, 1, 2, 'Main Switchboard & MCB Troubleshooting', 'Tripping issues, faulty breakers, fuse rewire and meter box safety inspection.', 449.00),
(3, 1, 2, 'Full Room Rewiring & Concealed Wiring', 'High gauge copper wiring with PVC casing and shock proof earthing.', 899.00),
(4, 2, 1, 'Tap & Pipe Leakage Repair', 'Quick gasket replacement, thread sealing, and dripping tap fixing.', 349.00),
(5, 2, 1, 'Water Heater / Geyser Installation', 'Inlet/outlet pipeline fixing, safety valve check, and power plug setup.', 549.00),
(6, 2, 1, 'Drain Blockage & Toilet Unclogging', 'Heavy duty snake mechanical unclogging for sink, bath drain, and WC.', 699.00),
(7, 3, 3, 'Door Lock & Handle Fitting', 'Cylindrical lock, mortise lock, or digital smart lock installation on wooden door.', 399.00),
(8, 3, 3, 'Furniture Assembly & Hinge Replacement', 'IKEA/Nilkamal furniture assembly, wardrobe drawer channel replacements.', 599.00),
(9, 4, 4, 'Jet Pump Foam Wash Service', 'Deep coil wash, tray cleaning, filter disinfection, pressure test.', 499.00),
(10, 4, 4, 'Freon / R32 Gas Top-up & Leak Fix', 'Nitrogen pressure leak detection, copper brazing, and gas recharging.', 1800.00),
(11, 5, 5, 'Full 2BHK Deep Cleaning Package', 'Complete scrubbing of floor, glass windows, bathroom tiles, and balcony.', 2499.00),
(12, 6, 7, 'Laptop General Service & Thermal Paste', 'Dust clean-out, Arctic MX-4 thermal paste renewal, overheating fix.', 499.00),
(13, 7, 9, 'Glow Facial & De-Tan Package', 'VLCC Ayurvedic herbal facial, neck massage, scrub and fruit peel.', 799.00),
(14, 10, 11, 'City Hourly Driving (Manual & Automatic)', 'Experienced driver for intra-city shopping, hospital visits, or office commutes (up to 4 hours).', 350.00),
(15, 10, 11, 'Outstation Round Trip Acting Driver', 'Safe highway driving for family vacations or business trips (per day charge).', 1200.00),
(16, 10, 11, 'Night & Party Call Driver', 'Safe night drop in your personal car across Chennai city limits.', 499.00),
(17, 11, 12, 'Doorstep Bike General Service & Oil Change', 'Complete engine oil flush, spark plug cleaning, chain lubrication, brake adjustment, and 20-point inspection.', 399.00),
(18, 11, 12, 'Emergency Roadside Puncture & Jumpstart', 'Tubeless tyre puncture patch or battery jumpstart at your breakdown location within 30 minutes.', 199.00),
(19, 11, 12, 'Brake Shoe & Chain Sprocket Overhaul', 'Replacement and fine tuning of front/rear brakes and drive chain kit.', 299.00),
(20, 12, 13, 'Doorstep Comprehensive Periodic Car Service', 'Engine oil replacement, oil filter, air filter cleaning, coolant top-up, and 40-point safety inspection.', 999.00),
(21, 12, 13, 'OBD-II Computer Scanning & Diagnosis', 'Electronic sensor check, check-engine light reset, battery and alternator health report.', 399.00),
(22, 12, 13, 'Brake Pad Replacement & Disc Cleaning', 'Front/rear brake pad swap, disc rotor cleaning, and brake fluid bleed.', 499.00),
(23, 13, 14, 'Rooftop Solar Panel Deep Chemical Wash', 'De-ionized water wash, anti-dust coating, bird drop removal, boosting power efficiency by up to 25%.', 599.00),
(24, 13, 14, 'Solar Inverter & Battery Health Check', 'Inverter error code diagnosis, wiring voltage drop test, and battery electrolyte level top-up.', 799.00),
(25, 13, 14, 'On-Grid / Hybrid Solar Installation Consultation', 'Rooftop shadow analysis, government subsidy eligibility estimate, and capacity sizing.', 1499.00);

-- ========================================================================
-- 5. BOOKINGS
-- ========================================================================
INSERT INTO bookings (id, customer_id, provider_id, service_id, booking_date, booking_time, address, description, status) VALUES
(1, 2, 1, 1, '2026-09-12', '10:00 AM', 'Flat 4B, Emerald Court, Velachery, Chennai', 'Living room ceiling fan is wobbling and producing humming sound.', 'COMPLETED'),
(2, 2, 2, 4, '2026-09-15', '02:00 PM', 'Flat 4B, Emerald Court, Velachery, Chennai', 'Kitchen sink inlet valve leaking under the counter.', 'ACCEPTED'),
(3, 3, 3, 7, '2026-09-16', '11:30 AM', '12th Cross, Indiranagar, Bangalore', 'Front main door Godrej lock is sticking.', 'PENDING'),
(4, 2, 4, 9, '2026-09-18', '04:00 PM', 'Flat 4B, Emerald Court, Velachery, Chennai', 'Annual AC servicing before summer peak.', 'PENDING');

-- ========================================================================
-- 6. REVIEWS
-- ========================================================================
INSERT INTO reviews (id, booking_id, customer_id, provider_id, rating, comment) VALUES
(1, 1, 2, 1, 5, 'Suresh arrived right on time, had all the tools, replaced the faulty capacitor and fixed the fan blade balance within 25 minutes! Outstanding service.');

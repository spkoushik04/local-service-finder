package com.localservicefinder.config;

import com.localservicefinder.entity.*;
import com.localservicefinder.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * DataInitializer: Automatically seeds initial categories, admin account,
 * verified providers, services, bookings, and reviews if the database is empty.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ServiceCategoryRepository categoryRepository,
                           ServiceProviderRepository providerRepository,
                           ServiceRepository serviceRepository,
                           BookingRepository bookingRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() > 0 && userRepository.count() > 0) {
            System.out.println("✅ Database already contains initial data. Skipping seed.");
            return;
        }

        System.out.println("🌱 Seeding initial Local Service Finder database...");

        // 1. Service Categories
        ServiceCategory plumbing = new ServiceCategory("Plumbing", "Pipe leaks, taps, sanitary fittings, water heater, and bathroom drainage.", "fa-faucet-drip");
        ServiceCategory electrical = new ServiceCategory("Electrical", "Wiring repairs, switchboard replacements, MCB issues, fan fittings, and home electrical setup.", "fa-bolt");
        ServiceCategory carpentry = new ServiceCategory("Carpentry", "Custom wooden furniture, door repairs, modular kitchen cabinets, and lock replacements.", "fa-hammer");
        ServiceCategory acRepair = new ServiceCategory("AC Repair", "Air conditioner servicing, gas refilling, cooling issues, filter cleaning, and new AC installation.", "fa-snowflake");
        ServiceCategory cleaning = new ServiceCategory("Home Cleaning", "Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa shampooing.", "fa-broom");
        ServiceCategory painting = new ServiceCategory("Painting", "Interior/exterior wall painting, waterproof primer coats, texture design, and touch-up works.", "fa-paint-roller");
        ServiceCategory compRepair = new ServiceCategory("Computer Repair", "Laptop hardware fixes, motherboard chip repairs, Windows/Mac OS reinstallations, and data recovery.", "fa-laptop-medical");
        ServiceCategory vehicle = new ServiceCategory("Vehicle Repair", "Two-wheeler and four-wheeler on-demand roadside assist, oil change, brake tune-up, and servicing.", "fa-wrench");
        ServiceCategory beauty = new ServiceCategory("Beauty Services", "Professional salon at home, hair styling, skin care, facials, waxing, and bridal grooming.", "fa-spa");
        ServiceCategory pest = new ServiceCategory("Pest Control", "Eco-friendly cockroach, termite, bed bug, rodent, and mosquito eradication treatments.", "fa-bug");
        ServiceCategory actingDriver = new ServiceCategory("Acting Driver", "Professional call & acting drivers for local city trips, hourly hire, outstation journeys, and luxury cars.", "fa-id-card");
        ServiceCategory bikeMechanic = new ServiceCategory("Bike Mechanic", "Doorstep two-wheeler servicing, oil change, engine tuning, tyre puncture, and roadside breakdown assistance.", "fa-motorcycle");
        ServiceCategory carMechanic = new ServiceCategory("Car Mechanic", "Multi-brand car periodic maintenance, engine OBD diagnostics, brake overhaul, clutch repair, and breakdown towing.", "fa-car");
        ServiceCategory solarPanel = new ServiceCategory("Solar Panel", "Rooftop solar installation, inverter & battery setup, deep solar panel cleaning, and efficiency maintenance.", "fa-solar-panel");

        List<ServiceCategory> categories = Arrays.asList(plumbing, electrical, carpentry, acRepair, cleaning, painting, compRepair, vehicle, beauty, pest, actingDriver, bikeMechanic, carMechanic, solarPanel);
        categoryRepository.saveAll(categories);

        // 2. Users
        String defaultPw = passwordEncoder.encode("password123");
        String koushikPw = passwordEncoder.encode("hitman45");
        String barathPw = passwordEncoder.encode("barath123");

        User adminKoushik = new User("Koushik S P", "koushik@gmail.com", "9876543210", koushikPw, Role.ADMIN, "Chennai", "HQ Anna Salai, T Nagar, Chennai");
        User adminBarath = new User("Barath S", "barath@gmail.com", "9876543211", barathPw, Role.ADMIN, "Chennai", "HQ Anna Salai, T Nagar, Chennai");
        User customer1 = new User("Rahul Sharma", "rahul@example.com", "9840123456", defaultPw, Role.CUSTOMER, "Chennai", "Flat 4B, Emerald Court, Velachery, Chennai");
        User customer2 = new User("Priya Sundaram", "priya@example.com", "9840987654", defaultPw, Role.CUSTOMER, "Bangalore", "12th Cross, Indiranagar, Bangalore");

        User provUser1 = new User("Suresh Kumar", "suresh@lsf.com", "9841122334", defaultPw, Role.PROVIDER, "Chennai", "24, MGR Road, Kodambakkam, Chennai");
        User provUser2 = new User("Murugan Selvam", "murugan@lsf.com", "9841233445", defaultPw, Role.PROVIDER, "Chennai", "56, South Usman Road, T Nagar, Chennai");
        User provUser3 = new User("Ramesh Babu", "ramesh@lsf.com", "9841344556", defaultPw, Role.PROVIDER, "Bangalore", "89, Koramangala 4th Block, Bangalore");
        User provUser4 = new User("Karthik Raja", "karthik@lsf.com", "9841455667", defaultPw, Role.PROVIDER, "Chennai", "15, 2nd Avenue, Anna Nagar, Chennai");
        User provUser5 = new User("Anitha Lakshmi", "anitha@lsf.com", "9841566778", defaultPw, Role.PROVIDER, "Coimbatore", "102, DB Road, RS Puram, Coimbatore");
        User provUser6 = new User("Vijay Anand", "vijay@lsf.com", "9841677889", defaultPw, Role.PROVIDER, "Hyderabad", "Hitech City Main Rd, Madhapur, Hyderabad");
        User provUser7 = new User("Deepa Mohan", "deepa@lsf.com", "9841788990", defaultPw, Role.PROVIDER, "Pondicherry", "Mission Street, White Town, Pondicherry");
        User provUser8 = new User("Dinesh Kumar", "dinesh@lsf.com", "9841999112", defaultPw, Role.PROVIDER, "Chennai", "10, Mount Road, Guindy, Chennai");
        User provUser9 = new User("Saravanan R", "saravanan.driver@lsf.com", "9841888222", defaultPw, Role.PROVIDER, "Chennai", "Velachery Main Road, Velachery, Chennai");
        User provUser10 = new User("Vignesh Kumar", "vignesh.bike@lsf.com", "9841777333", defaultPw, Role.PROVIDER, "Chennai", "100 Feet Road, Vadapalani, Chennai");
        User provUser11 = new User("Manikandan S", "manikandan.car@lsf.com", "9841666444", defaultPw, Role.PROVIDER, "Chennai", "GST Road, Tambaram, Chennai");
        User provUser12 = new User("Ganesh Moorthy", "ganesh.solar@lsf.com", "9841555555", defaultPw, Role.PROVIDER, "Chennai", "OMR IT Corridor, Thoraipakkam, Chennai");

        userRepository.saveAll(Arrays.asList(adminKoushik, adminBarath, customer1, customer2, provUser1, provUser2, provUser3, provUser4, provUser5, provUser6, provUser7, provUser8, provUser9, provUser10, provUser11, provUser12));

        // 3. Service Providers
        ServiceProvider sp1 = new ServiceProvider(provUser1, electrical, "Suresh Super Electricals", 8, "Licensed government wireman with 8+ years expertise in residential and commercial electrical maintenance.", new BigDecimal("299.00"), "Chennai", provUser1.getAddress(), "8:00 AM - 8:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.8);
        ServiceProvider sp2 = new ServiceProvider(provUser2, plumbing, "Murugan Quick Plumbers", 11, "Specialist in instant leakage plugging, pump motors, pipeline laying, and sanitary fixtures across Chennai.", new BigDecimal("349.00"), "Chennai", provUser2.getAddress(), "7:00 AM - 9:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.9);
        ServiceProvider sp3 = new ServiceProvider(provUser3, carpentry, "Babu Artisan Carpentry", 6, "Skilled carpentry services for custom furniture, wardrobe repair, lock changes, and modular kitchen fittings.", new BigDecimal("399.00"), "Bangalore", provUser3.getAddress(), "9:00 AM - 7:00 PM", "Available Tomorrow", true, ProviderStatus.APPROVED, 4.7);
        ServiceProvider sp4 = new ServiceProvider(provUser4, acRepair, "CoolTech AC Care", 7, "Certified technician for split and inverter AC gas filling, compressor repair, jet chemical service.", new BigDecimal("499.00"), "Chennai", provUser4.getAddress(), "8:30 AM - 8:30 PM", "Available Today", true, ProviderStatus.APPROVED, 4.9);
        ServiceProvider sp5 = new ServiceProvider(provUser5, cleaning, "SparklePro Cleaners", 5, "Hospital-grade sanitized home deep cleaning, kitchen degreasing, bathroom scrubbing with mechanized tools.", new BigDecimal("799.00"), "Coimbatore", provUser5.getAddress(), "9:00 AM - 6:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.6);
        ServiceProvider sp6 = new ServiceProvider(provUser6, compRepair, "CyberDoc PC Doctors", 9, "Same-day doorstep laptop diagnosis, screen replacements, SSD upgrades, and Windows troubleshoot.", new BigDecimal("350.00"), "Hyderabad", provUser6.getAddress(), "10:00 AM - 9:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.8);
        ServiceProvider sp7 = new ServiceProvider(provUser7, beauty, "Deepa Herbal Salon", 6, "Hygienic salon treatments, organic herbal facials, bridal packages delivered with single-use kits.", new BigDecimal("450.00"), "Pondicherry", provUser7.getAddress(), "10:00 AM - 7:00 PM", "Available Tomorrow", true, ProviderStatus.APPROVED, 4.9);
        ServiceProvider sp8 = new ServiceProvider(provUser8, plumbing, "Dinesh Express Plumbing", 3, "Fresh local plumbing service awaiting initial verification.", new BigDecimal("250.00"), "Chennai", provUser8.getAddress(), "9:00 AM - 7:00 PM", "Available Today", false, ProviderStatus.PENDING, 0.0);
        ServiceProvider sp9 = new ServiceProvider(provUser9, actingDriver, "CityPro Acting Drivers", 10, "Professional RTO verified acting drivers with 10+ years experience in manual & automatic luxury cars for city, night, and outstation trips.", new BigDecimal("350.00"), "Chennai", provUser9.getAddress(), "24 Hours / On-Demand", "Available Today", true, ProviderStatus.APPROVED, 4.9);
        ServiceProvider sp10 = new ServiceProvider(provUser10, bikeMechanic, "Speedy Two-Wheeler Garage", 8, "Expert doorstep bike & scooter mechanics for Honda, Yamaha, Royal Enfield, and EV bikes. Quick breakdown & tyre fix.", new BigDecimal("199.00"), "Chennai", provUser10.getAddress(), "8:00 AM - 9:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.8);
        ServiceProvider sp11 = new ServiceProvider(provUser11, carMechanic, "Apex Auto Car Care", 12, "Multi-brand car specialist offering doorstep periodic maintenance, computer OBD scanner diagnostics, clutch & brake overhauls.", new BigDecimal("499.00"), "Chennai", provUser11.getAddress(), "8:30 AM - 8:30 PM", "Available Today", true, ProviderStatus.APPROVED, 4.9);
        ServiceProvider sp12 = new ServiceProvider(provUser12, solarPanel, "SunPower Solar Solutions", 7, "MNRE certified solar rooftop technician specializing in on-grid/off-grid solar installation, inverter servicing, and eco-friendly panel wash.", new BigDecimal("599.00"), "Chennai", provUser12.getAddress(), "9:00 AM - 7:00 PM", "Available Today", true, ProviderStatus.APPROVED, 4.9);

        providerRepository.saveAll(Arrays.asList(sp1, sp2, sp3, sp4, sp5, sp6, sp7, sp8, sp9, sp10, sp11, sp12));

        // 4. Services
        Service s1 = new Service(sp1, electrical, "Ceiling Fan Installation & Repair", "Unmounting, balancing, capacitor replacement or new fan installation.", new BigDecimal("299.00"));
        Service s2 = new Service(sp1, electrical, "Main Switchboard & MCB Troubleshooting", "Tripping issues, faulty breakers, fuse rewire and meter box safety inspection.", new BigDecimal("449.00"));
        Service s3 = new Service(sp2, plumbing, "Tap & Pipe Leakage Repair", "Quick gasket replacement, thread sealing, and dripping tap fixing.", new BigDecimal("349.00"));
        Service s4 = new Service(sp2, plumbing, "Water Heater / Geyser Installation", "Inlet/outlet pipeline fixing, safety valve check, and power plug setup.", new BigDecimal("549.00"));
        Service s5 = new Service(sp3, carpentry, "Door Lock & Handle Fitting", "Cylindrical lock, mortise lock, or digital smart lock installation on wooden door.", new BigDecimal("399.00"));
        Service s6 = new Service(sp4, acRepair, "Jet Pump Foam Wash Service", "Deep coil wash, tray cleaning, filter disinfection, pressure test.", new BigDecimal("499.00"));
        Service s7 = new Service(sp4, acRepair, "Freon / R32 Gas Top-up & Leak Fix", "Nitrogen pressure leak detection, copper brazing, and gas recharging.", new BigDecimal("1800.00"));
        Service s8 = new Service(sp5, cleaning, "Full 2BHK Deep Cleaning Package", "Complete scrubbing of floor, glass windows, bathroom tiles, and balcony.", new BigDecimal("2499.00"));
        Service s9 = new Service(sp6, compRepair, "Laptop General Service & Thermal Paste", "Dust clean-out, Arctic MX-4 thermal paste renewal, overheating fix.", new BigDecimal("499.00"));
        Service s10 = new Service(sp7, beauty, "Glow Facial & De-Tan Package", "VLCC Ayurvedic herbal facial, neck massage, scrub and fruit peel.", new BigDecimal("799.00"));

        // Acting Driver Services
        Service s11 = new Service(sp9, actingDriver, "City Hourly Driving (Manual & Automatic)", "Experienced driver for intra-city shopping, hospital visits, or office commutes (up to 4 hours).", new BigDecimal("350.00"));
        Service s12 = new Service(sp9, actingDriver, "Outstation Round Trip Acting Driver", "Safe highway driving for family vacations or business trips (per day charge).", new BigDecimal("1200.00"));
        Service s13 = new Service(sp9, actingDriver, "Night & Party Call Driver", "Safe night drop in your personal car across Chennai city limits.", new BigDecimal("499.00"));

        // Bike Mechanic Services
        Service s14 = new Service(sp10, bikeMechanic, "Doorstep Bike General Service & Oil Change", "Complete engine oil flush, spark plug cleaning, chain lubrication, brake adjustment, and 20-point inspection.", new BigDecimal("399.00"));
        Service s15 = new Service(sp10, bikeMechanic, "Emergency Roadside Puncture & Jumpstart", "Tubeless tyre puncture patch or battery jumpstart at your breakdown location within 30 minutes.", new BigDecimal("199.00"));
        Service s16 = new Service(sp10, bikeMechanic, "Brake Shoe & Chain Sprocket Overhaul", "Replacement and fine tuning of front/rear brakes and drive chain kit.", new BigDecimal("299.00"));

        // Car Mechanic Services
        Service s17 = new Service(sp11, carMechanic, "Doorstep Comprehensive Periodic Car Service", "Engine oil replacement, oil filter, air filter cleaning, coolant top-up, and 40-point safety inspection.", new BigDecimal("999.00"));
        Service s18 = new Service(sp11, carMechanic, "OBD-II Computer Scanning & Diagnosis", "Electronic sensor check, check-engine light reset, battery and alternator health report.", new BigDecimal("399.00"));
        Service s19 = new Service(sp11, carMechanic, "Brake Pad Replacement & Disc Cleaning", "Front/rear brake pad swap, disc rotor cleaning, and brake fluid bleed.", new BigDecimal("499.00"));

        // Solar Panel Services
        Service s20 = new Service(sp12, solarPanel, "Rooftop Solar Panel Deep Chemical Wash", "De-ionized water wash, anti-dust coating, bird drop removal, boosting power efficiency by up to 25%.", new BigDecimal("599.00"));
        Service s21 = new Service(sp12, solarPanel, "Solar Inverter & Battery Health Check", "Inverter error code diagnosis, wiring voltage drop test, and battery electrolyte level top-up.", new BigDecimal("799.00"));
        Service s22 = new Service(sp12, solarPanel, "On-Grid / Hybrid Solar Installation Consultation", "Rooftop shadow analysis, government subsidy eligibility estimate, and capacity sizing.", new BigDecimal("1499.00"));

        serviceRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22));

        // 5. Bookings
        Booking b1 = new Booking(customer1, sp1, s1, LocalDate.now().minusDays(3), "10:00 AM", customer1.getAddress(), "Living room ceiling fan is wobbling and humming.", BookingStatus.COMPLETED);
        Booking b2 = new Booking(customer1, sp2, s3, LocalDate.now().plusDays(2), "02:00 PM", customer1.getAddress(), "Kitchen sink inlet valve leaking under the counter.", BookingStatus.ACCEPTED);
        Booking b3 = new Booking(customer2, sp3, s5, LocalDate.now().plusDays(3), "11:30 AM", customer2.getAddress(), "Front main door Godrej lock is sticking.", BookingStatus.PENDING);
        Booking b4 = new Booking(customer1, sp4, s6, LocalDate.now().plusDays(5), "04:00 PM", customer1.getAddress(), "Annual AC servicing before summer peak.", BookingStatus.PENDING);

        bookingRepository.saveAll(Arrays.asList(b1, b2, b3, b4));

        // 6. Review
        Review rev1 = new Review(b1, customer1, sp1, 5, "Suresh arrived right on time, had all the tools, replaced the faulty capacitor and fixed the fan blade balance within 25 minutes! Outstanding service.");
        reviewRepository.save(rev1);

        System.out.println("✅ Data seeding completed successfully!");
    }
}

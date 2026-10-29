/**
 * Local Service Finder - Core JavaScript Utility & Navigation Manager
 * Handles API URLs, Toast alerts, Auth Session in localStorage, and Navbar rendering
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname
    ? 'http://localhost:8080/api'
    : `http://${window.location.hostname}:8080/api`;

// ==========================================================================
// Toast Notification Utility
// ==========================================================================
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `
        <i class="fas ${iconClass}" style="font-size: 1.25rem;"></i>
        <div style="flex-grow: 1; font-size: 0.9rem;">${message}</div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ==========================================================================
// User Session & LocalStorage Auth State
// ==========================================================================
function getCurrentUser() {
    try {
        const stored = localStorage.getItem('lsf_user');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('lsf_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('lsf_user');
    }
}

function logout() {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 400);
}

// Global Auth Gatekeeper: Requires login to view any project page
(function checkGlobalAuth() {
    const publicPages = ['login.html', 'register.html', 'provider-register.html'];
    const path = window.location.pathname.toLowerCase();
    let page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    if (!page || page === '') page = 'index.html';

    const user = getCurrentUser();

    if (!user) {
        if (!publicPages.includes(page)) {
            window.location.replace('login.html');
        }
    }
})();

function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    if (!user) {
        window.location.replace('login.html');
        return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        showToast('You are not authorized to view this page', 'error');
        setTimeout(() => {
            if (user.role === 'CUSTOMER') window.location.href = 'customer-dashboard.html';
            else if (user.role === 'PROVIDER') window.location.href = 'provider-dashboard.html';
            else if (user.role === 'ADMIN') window.location.href = 'admin-dashboard.html';
            else window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    return true;
}

// ==========================================================================
// Formatters
// ==========================================================================
function formatCurrency(amount) {
    if (amount == null) return '₹0';
    return '₹' + parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ==========================================================================
// Dynamic Navbar Sync
// ==========================================================================
function setupNavbar() {
    const navAuthContainer = document.getElementById('nav-auth-container');
    const user = getCurrentUser();

    if (navAuthContainer) {
        if (user) {
            let dashboardUrl = 'customer-dashboard.html';
            if (user.role === 'PROVIDER') dashboardUrl = 'provider-dashboard.html';
            if (user.role === 'ADMIN') dashboardUrl = 'admin-dashboard.html';

            navAuthContainer.innerHTML = `
                <a href="${dashboardUrl}" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]} (${user.role})
                </a>
                <button onclick="logout()" class="btn btn-outline btn-sm">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        } else {
            navAuthContainer.innerHTML = `
                <a href="login.html" class="btn btn-outline btn-sm">Login</a>
                <a href="register.html" class="btn btn-primary btn-sm">Register</a>
            `;
        }
    }

    // Hamburger Mobile Toggle
    const navToggle = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu-list');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// ==========================================================================
// Embedded Fallback Dataset (Ensures 100% UI Functionality Even Before Backend Launch)
// ==========================================================================
const FALLBACK_CATEGORIES = [
    { id: 1, name: 'Plumbing', description: 'Pipe leaks, taps, sanitary fittings, water heater installation and drainage.', icon: 'fa-faucet-drip' },
    { id: 2, name: 'Electrical', description: 'Wiring repairs, switchboard replacements, MCB issues, fan fittings, and home setup.', icon: 'fa-bolt' },
    { id: 3, name: 'Carpentry', description: 'Custom wooden furniture, door repairs, modular kitchen cabinets, and lock fixes.', icon: 'fa-hammer' },
    { id: 4, name: 'AC Repair', description: 'Air conditioner servicing, gas refilling, cooling issues, and deep chemical wash.', icon: 'fa-snowflake' },
    { id: 5, name: 'Home Cleaning', description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitation, and sofa shampooing.', icon: 'fa-broom' },
    { id: 6, name: 'Painting', description: 'Interior/exterior wall painting, waterproof primer coats, texture design, and touch-ups.', icon: 'fa-paint-roller' },
    { id: 7, name: 'Computer Repair', description: 'Laptop hardware fixes, motherboard chip repairs, Windows reinstallations, and SSD upgrades.', icon: 'fa-laptop-medical' },
    { id: 8, name: 'Vehicle Repair', description: 'Two-wheeler and four-wheeler on-demand roadside assist, oil change, and brake tune-up.', icon: 'fa-wrench' },
    { id: 9, name: 'Beauty Services', description: 'Professional salon at home, hair styling, skin care, facials, waxing, and grooming.', icon: 'fa-spa' },
    { id: 10, name: 'Pest Control', description: 'Eco-friendly cockroach, termite, bed bug, rodent, and mosquito eradication treatments.', icon: 'fa-bug' },
    { id: 11, name: 'Acting Driver', description: 'Professional call & acting drivers for local city trips, hourly hire, outstation journeys, and luxury cars.', icon: 'fa-id-card' },
    { id: 12, name: 'Bike Mechanic', description: 'Doorstep two-wheeler servicing, oil change, engine tuning, tyre puncture, and roadside breakdown assistance.', icon: 'fa-motorcycle' },
    { id: 13, name: 'Car Mechanic', description: 'Multi-brand car periodic maintenance, engine OBD diagnostics, brake overhaul, clutch repair, and breakdown towing.', icon: 'fa-car' },
    { id: 14, name: 'Solar Panel', description: 'Rooftop solar installation, inverter & battery setup, deep solar panel cleaning, and efficiency maintenance.', icon: 'fa-solar-panel' }
];

const FALLBACK_PROVIDERS = [
    {
        id: 1, userId: 4, name: 'Suresh Kumar', email: 'suresh.electrical@example.com', phone: '9841122334',
        businessName: 'Suresh Super Electricals', categoryId: 2, categoryName: 'Electrical', categoryIcon: 'fa-bolt',
        experience: 8, description: 'Licensed government wireman with 8+ years expertise in residential and commercial electrical maintenance.',
        startingPrice: 299.00, city: 'Chennai', address: '24, MGR Road, Kodambakkam, Chennai',
        workingHours: '8:00 AM - 8:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.8, reviewsCount: 14,
        services: [
            { id: 1, serviceName: 'Ceiling Fan Installation & Repair', price: 299.00, description: 'Unmounting, balancing, capacitor replacement or new fan installation.' },
            { id: 2, serviceName: 'Main Switchboard & MCB Troubleshooting', price: 449.00, description: 'Tripping issues, faulty breakers, fuse rewire and safety check.' }
        ]
    },
    {
        id: 2, userId: 5, name: 'Murugan Selvam', email: 'murugan.plumbing@example.com', phone: '9841233445',
        businessName: 'Murugan Quick Plumbers', categoryId: 1, categoryName: 'Plumbing', categoryIcon: 'fa-faucet-drip',
        experience: 11, description: 'Specialist in instant leakage plugging, pump motors, pipeline laying, and sanitary fixtures.',
        startingPrice: 349.00, city: 'Chennai', address: '56, South Usman Road, T Nagar, Chennai',
        workingHours: '7:00 AM - 9:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.9, reviewsCount: 22,
        services: [
            { id: 3, serviceName: 'Tap & Pipe Leakage Repair', price: 349.00, description: 'Quick gasket replacement, thread sealing, and dripping tap fixing.' },
            { id: 4, serviceName: 'Water Heater / Geyser Installation', price: 549.00, description: 'Inlet/outlet pipeline fixing, safety valve check, and power plug setup.' }
        ]
    },
    {
        id: 3, userId: 6, name: 'Ramesh Babu', email: 'ramesh.carpentry@example.com', phone: '9841344556',
        businessName: 'Babu Artisan Carpentry', categoryId: 3, categoryName: 'Carpentry', categoryIcon: 'fa-hammer',
        experience: 6, description: 'Skilled carpentry services for custom furniture, wardrobe repair, lock changes, and modular fittings.',
        startingPrice: 399.00, city: 'Bangalore', address: '89, Koramangala 4th Block, Bangalore',
        workingHours: '9:00 AM - 7:00 PM', availability: 'Available Tomorrow', verified: true, status: 'APPROVED', rating: 4.7, reviewsCount: 9,
        services: [
            { id: 5, serviceName: 'Door Lock & Handle Fitting', price: 399.00, description: 'Cylindrical lock, mortise lock, or digital lock installation.' }
        ]
    },
    {
        id: 4, userId: 7, name: 'Karthik Raja', email: 'karthik.ac@example.com', phone: '9841455667',
        businessName: 'CoolTech AC Care & Solutions', categoryId: 4, categoryName: 'AC Repair', categoryIcon: 'fa-snowflake',
        experience: 7, description: 'Certified technician for split and inverter AC gas filling, compressor repair, and jet wash.',
        startingPrice: 499.00, city: 'Chennai', address: '15, 2nd Avenue, Anna Nagar, Chennai',
        workingHours: '8:30 AM - 8:30 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.9, reviewsCount: 31,
        services: [
            { id: 6, serviceName: 'Jet Pump Foam Wash Service', price: 499.00, description: 'Deep coil wash, tray cleaning, filter disinfection, pressure test.' },
            { id: 7, serviceName: 'Freon / R32 Gas Top-up & Leak Fix', price: 1800.00, description: 'Nitrogen pressure leak detection, copper brazing, and recharging.' }
        ]
    },
    {
        id: 5, userId: 8, name: 'Anitha Lakshmi', email: 'anitha.cleaning@example.com', phone: '9841566778',
        businessName: 'SparklePro Cleaners', categoryId: 5, categoryName: 'Home Cleaning', categoryIcon: 'fa-broom',
        experience: 5, description: 'Hospital-grade sanitized home deep cleaning, kitchen degreasing, bathroom scrubbing with mechanized tools.',
        startingPrice: 799.00, city: 'Coimbatore', address: '102, DB Road, RS Puram, Coimbatore',
        workingHours: '9:00 AM - 6:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.6, reviewsCount: 18,
        services: [
            { id: 8, serviceName: 'Full 2BHK Deep Cleaning Package', price: 2499.00, description: 'Complete scrubbing of floor, glass windows, bathroom tiles, and balcony.' }
        ]
    },
    {
        id: 6, userId: 9, name: 'Vijay Anand', email: 'vijay.tech@example.com', phone: '9841677889',
        businessName: 'CyberDoc Laptop & PC Doctors', categoryId: 7, categoryName: 'Computer Repair', categoryIcon: 'fa-laptop-medical',
        experience: 9, description: 'Same-day doorstep laptop diagnosis, screen replacements, SSD upgrades, and Windows troubleshoot.',
        startingPrice: 350.00, city: 'Hyderabad', address: 'Hitech City Main Rd, Madhapur, Hyderabad',
        workingHours: '10:00 AM - 9:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.8, reviewsCount: 16,
        services: [
            { id: 9, serviceName: 'Laptop General Service & Thermal Paste', price: 499.00, description: 'Dust clean-out, Arctic MX-4 thermal paste renewal, overheating fix.' }
        ]
    },
    {
        id: 7, userId: 13, name: 'Saravanan R', email: 'saravanan.driver@lsf.com', phone: '9841888222',
        businessName: 'CityPro Acting Drivers', categoryId: 11, categoryName: 'Acting Driver', categoryIcon: 'fa-id-card',
        experience: 10, description: 'Professional RTO verified acting drivers with 10+ years experience in manual & automatic luxury cars for city, night, and outstation trips.',
        startingPrice: 350.00, city: 'Chennai', address: 'Velachery Main Road, Velachery, Chennai',
        workingHours: '24 Hours / On-Demand', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.9, reviewsCount: 38,
        services: [
            { id: 14, serviceName: 'City Hourly Driving (Manual & Automatic)', price: 350.00, description: 'Experienced driver for intra-city shopping, hospital visits, or office commutes (up to 4 hours).' },
            { id: 15, serviceName: 'Outstation Round Trip Acting Driver', price: 1200.00, description: 'Safe highway driving for family vacations or business trips (per day charge).' },
            { id: 16, serviceName: 'Night & Party Call Driver', price: 499.00, description: 'Safe night drop in your personal car across Chennai city limits.' }
        ]
    },
    {
        id: 8, userId: 14, name: 'Vignesh Kumar', email: 'vignesh.bike@lsf.com', phone: '9841777333',
        businessName: 'Speedy Two-Wheeler Garage', categoryId: 12, categoryName: 'Bike Mechanic', categoryIcon: 'fa-motorcycle',
        experience: 8, description: 'Expert doorstep bike & scooter mechanics for Honda, Yamaha, Royal Enfield, and EV bikes. Quick breakdown & tyre fix.',
        startingPrice: 199.00, city: 'Chennai', address: '100 Feet Road, Vadapalani, Chennai',
        workingHours: '8:00 AM - 9:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.8, reviewsCount: 45,
        services: [
            { id: 17, serviceName: 'Doorstep Bike General Service & Oil Change', price: 399.00, description: 'Complete engine oil flush, spark plug cleaning, chain lubrication, brake adjustment, and 20-point inspection.' },
            { id: 18, serviceName: 'Emergency Roadside Puncture & Jumpstart', price: 199.00, description: 'Tubeless tyre puncture patch or battery jumpstart at your breakdown location within 30 minutes.' },
            { id: 19, serviceName: 'Brake Shoe & Chain Sprocket Overhaul', price: 299.00, description: 'Replacement and fine tuning of front/rear brakes and drive chain kit.' }
        ]
    },
    {
        id: 9, userId: 15, name: 'Manikandan S', email: 'manikandan.car@lsf.com', phone: '9841666444',
        businessName: 'Apex Auto Car Care', categoryId: 13, categoryName: 'Car Mechanic', categoryIcon: 'fa-car',
        experience: 12, description: 'Multi-brand car specialist offering doorstep periodic maintenance, computer OBD scanner diagnostics, clutch & brake overhauls.',
        startingPrice: 499.00, city: 'Chennai', address: 'GST Road, Tambaram, Chennai',
        workingHours: '8:30 AM - 8:30 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.9, reviewsCount: 52,
        services: [
            { id: 20, serviceName: 'Doorstep Comprehensive Periodic Car Service', price: 999.00, description: 'Engine oil replacement, oil filter, air filter cleaning, coolant top-up, and 40-point safety inspection.' },
            { id: 21, serviceName: 'OBD-II Computer Scanning & Diagnosis', price: 399.00, description: 'Electronic sensor check, check-engine light reset, battery and alternator health report.' },
            { id: 22, serviceName: 'Brake Pad Replacement & Disc Cleaning', price: 499.00, description: 'Front/rear brake pad swap, disc rotor cleaning, and brake fluid bleed.' }
        ]
    },
    {
        id: 10, userId: 16, name: 'Ganesh Moorthy', email: 'ganesh.solar@lsf.com', phone: '9841555555',
        businessName: 'SunPower Solar Solutions', categoryId: 14, categoryName: 'Solar Panel', categoryIcon: 'fa-solar-panel',
        experience: 7, description: 'MNRE certified solar rooftop technician specializing in on-grid/off-grid solar installation, inverter servicing, and eco-friendly panel wash.',
        startingPrice: 599.00, city: 'Chennai', address: 'OMR IT Corridor, Thoraipakkam, Chennai',
        workingHours: '9:00 AM - 7:00 PM', availability: 'Available Today', verified: true, status: 'APPROVED', rating: 4.9, reviewsCount: 26,
        services: [
            { id: 23, serviceName: 'Rooftop Solar Panel Deep Chemical Wash', price: 599.00, description: 'De-ionized water wash, anti-dust coating, bird drop removal, boosting power efficiency by up to 25%.' },
            { id: 24, serviceName: 'Solar Inverter & Battery Health Check', price: 799.00, description: 'Inverter error code diagnosis, wiring voltage drop test, and battery electrolyte level top-up.' },
            { id: 25, serviceName: 'On-Grid / Hybrid Solar Installation Consultation', price: 1499.00, description: 'Rooftop shadow analysis, government subsidy eligibility estimate, and capacity sizing.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
});


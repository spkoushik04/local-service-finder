# Local Service Finder 🛠️

A modern, full-stack web application designed to connect local service providers (plumbers, electricians, cleaners, carpenters, painters, and more) with customers in need of immediate services.

---

## 🌟 Key Features

- **Customer Portal**:
  - Browse by service categories (Electrician, Plumber, Appliance Repair, Cleaning, etc.).
  - Search providers by location, rating, and service type.
  - Book services with customizable date and time slots.
  - View booking history, live status, and leave ratings & reviews.

- **Service Provider Portal**:
  - Provider registration and profile management.
  - Service catalog management (pricing, hourly rates, experience).
  - Booking requests dashboard: Accept, complete, or reject requests.

- **Admin Dashboard**:
  - Comprehensive platform statistics (Users, Providers, Bookings, Revenue).
  - Provider verification and approval workflow.
  - Manage categories and active services.

- **Mobile Friendly UI**:
  - Responsive layouts styled for both mobile screens and desktop browsers.

---

## 🏗️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), FontAwesome Icons
- **Backend**: Java 17+, Spring Boot 3, Spring Data JPA, Spring Web MVC
- **Database**: MySQL (Compatible with H2 Database for local development)
- **Build Tool**: Apache Maven

---

## 🚀 Getting Started

### Prerequisites
- Java JDK 17 or higher
- MySQL Server (default port `3306`)
- Python 3.x (optional, for frontend local server)

### Database Setup
1. Open your MySQL client and run:
   ```sql
   CREATE DATABASE local_service_finder;
   ```
2. Configure credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/local_service_finder
   spring.datasource.username=root
   spring.datasource.password=YourPassword
   ```

### Running Locally

1. **Start Backend**:
   - Double-click `run-backend.bat` or run:
     ```bash
     cd backend
     mvn spring-boot:run
     ```
   - Backend runs on `http://localhost:8080` (API base: `http://localhost:8080/api`).

2. **Start Frontend**:
   - Double-click `run-frontend.bat` or run:
     ```bash
     cd frontend
     python -m http.server 3000
     ```
   - Open in browser: `http://localhost:3000/login.html`

### 📱 Using on Mobile (Local Wi-Fi)
1. Ensure your PC and mobile device are on the same Wi-Fi network.
2. Run both `run-backend.bat` and `run-frontend.bat`.
3. Open `http://<YOUR_PC_IP>:3000/login.html` on your mobile phone browser (e.g., `http://192.168.1.8:3000/login.html`).

---

## 📁 Project Structure

```text
local-service-finder/
├── backend/                  # Spring Boot 3 Java Backend
│   ├── src/                  # Controllers, Services, Models, Repositories
│   └── pom.xml               # Maven dependencies
├── frontend/                 # HTML5, CSS3, Vanilla JS Web Frontend
│   ├── css/                  # Styling & responsive design
│   ├── js/                   # Authentication, dashboard, booking logic
│   ├── images/               # Banners, service icons
│   └── *.html                # Web pages
├── database/                 # SQL schemas and initial datasets
├── run-backend.bat           # 1-click backend runner
├── run-frontend.bat          # 1-click frontend runner
└── README.md
```

---

## 👨‍💻 Author
**Koushik S P**  
GitHub: [@spkoushik04](https://github.com/spkoushik04)

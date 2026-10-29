/**
 * Authentication JavaScript Module (Vanilla JS)
 * Handles User Login, Customer Registration, and Provider Registration with Spring Boot API
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initCustomerRegisterForm();
    initProviderRegisterForm();
});

// ==========================================================================
// 1. User Login Handler (Clean, Classic Flow)
// ==========================================================================
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    // Password Show/Hide Toggle
    const toggleBtn = document.getElementById('password-toggle-btn');
    const passInput = document.getElementById('password');
    const eyeIcon = document.getElementById('password-eye-icon');

    if (toggleBtn && passInput && eyeIcon) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            eyeIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            toggleBtn.setAttribute('title', isPassword ? 'Hide Password' : 'Show Password');
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('login-submit-btn');

        if (!email || !password) {
            showToast('Please fill in both email and password', 'warning');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const user = result.data;
                setCurrentUser(user);
                showToast(`Welcome back, ${user.name}!`, 'success');

                setTimeout(() => {
                    if (user.role === 'ADMIN') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (user.role === 'PROVIDER') {
                        window.location.href = 'provider-dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 800);
            } else {
                showToast(result.message || 'Invalid email or password', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-lock-open"></i> Login';
            }
        } catch (error) {
            console.warn('Backend offline, checking offline fallback credentials:', error);
            if (email === 'koushik@gmail.com') {
                if (password && password !== 'hitman45') {
                    showToast('Invalid password for Koushik. (Use: hitman45)', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-lock-open"></i> Login';
                    return;
                }
                const demoAdmin = { id: 1, name: 'Koushik S P', email: 'koushik@gmail.com', role: 'ADMIN', city: 'Chennai' };
                setCurrentUser(demoAdmin);
                showToast('Welcome Admin Koushik S P!', 'success');
                setTimeout(() => window.location.href = 'admin-dashboard.html', 800);
                return;
            } else if (email === 'barath@gmail.com') {
                if (password && password !== 'barath123') {
                    showToast('Invalid password for Barath. (Use: barath123)', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-lock-open"></i> Login';
                    return;
                }
                const demoAdmin = { id: 17, name: 'Barath S', email: 'barath@gmail.com', role: 'ADMIN', city: 'Chennai' };
                setCurrentUser(demoAdmin);
                showToast('Welcome Admin Barath S!', 'success');
                setTimeout(() => window.location.href = 'admin-dashboard.html', 800);
                return;
            } else if (email === 'servicefinder@gmail.com' || email === 'admin@lsf.com' || email === 'admin@localservicefinder.com') {
                const demoAdmin = { id: 1, name: 'Koushik S P', email: 'koushik@gmail.com', role: 'ADMIN', city: 'Chennai' };
                setCurrentUser(demoAdmin);
                showToast('Logged in as Administrator.', 'success');
                setTimeout(() => window.location.href = 'admin-dashboard.html', 800);
                return;
            } else if (email === 'rahul@example.com' || email === 'customer@example.com') {
                const demoCustomer = { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'CUSTOMER', city: 'Chennai', address: 'Flat 4B, Emerald Court, Velachery, Chennai' };
                setCurrentUser(demoCustomer);
                showToast('Logged in as Customer.', 'success');
                setTimeout(() => window.location.href = 'index.html', 800);
                return;
            } else if (email === 'suresh@lsf.com' || email === 'suresh.electrical@example.com' || email === 'provider@lsf.com') {
                const demoProvider = { id: 4, name: 'Suresh Kumar', email: 'suresh@lsf.com', role: 'PROVIDER', providerId: 1, city: 'Chennai' };
                setCurrentUser(demoProvider);
                showToast('Logged in as Provider.', 'success');
                setTimeout(() => window.location.href = 'provider-dashboard.html', 800);
                return;
            }

            showToast('Unable to connect to server. Start Spring Boot or use demo credentials.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock-open"></i> Login';
        }
    });
}



// ==========================================================================
// 2. Customer Registration Handler
// ==========================================================================
function initCustomerRegisterForm() {
    const registerForm = document.getElementById('customer-register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const city = document.getElementById('city').value.trim();
        const address = document.getElementById('address').value.trim();
        const submitBtn = document.getElementById('register-submit-btn');

        // Validation
        if (!name || !email || !phone || !password || !city || !address) {
            showToast('Please fill out all required fields.', 'warning');
            return;
        }

        if (password.length < 4) {
            showToast('Password must be at least 4 characters long.', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, confirmPassword, city, address })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showToast('Registration successful! Please login with your credentials.', 'success');
                setTimeout(() => {
                    window.location.href = `login.html?registered=true&email=${encodeURIComponent(email)}`;
                }, 1500);
            } else {
                showToast(result.message || 'Registration failed', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register as Customer';
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Connection error with backend server.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Register as Customer';
        }
    });
}

// ==========================================================================
// 3. Service Provider Registration Handler
// ==========================================================================
async function initProviderRegisterForm() {
    const provForm = document.getElementById('provider-register-form');
    if (!provForm) return;

    // Load category options into dropdown
    const categorySelect = document.getElementById('categoryId');
    if (categorySelect) {
        try {
            const resp = await fetch(`${API_BASE_URL}/services`);
            if (resp.ok) {
                const resData = await resp.json();
                if (resData.success && resData.data) {
                    categorySelect.innerHTML = '<option value="">-- Select Service Category --</option>' +
                        resData.data.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
                }
            }
        } catch (err) {
            console.warn('Could not load categories dynamically:', err);
        }
    }

    provForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const businessName = document.getElementById('businessName').value.trim();
        const categoryId = document.getElementById('categoryId').value;
        const experience = parseInt(document.getElementById('experience').value, 10);
        const city = document.getElementById('city').value.trim();
        const address = document.getElementById('address').value.trim();
        const description = document.getElementById('description').value.trim();
        const startingPrice = parseFloat(document.getElementById('startingPrice').value);
        const workingHours = document.getElementById('workingHours').value.trim();
        const submitBtn = document.getElementById('prov-register-submit-btn');

        if (!name || !email || !phone || !password || !businessName || !categoryId || isNaN(experience) || !city || !address || isNaN(startingPrice)) {
            showToast('Please fill all mandatory provider fields.', 'warning');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';

            const response = await fetch(`${API_BASE_URL}/auth/register-provider`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, phone, password, businessName, categoryId,
                    experience, city, address, description, startingPrice, workingHours
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showToast('Provider application submitted! Status is PENDING admin approval.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showToast(result.message || 'Provider registration failed.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register as Service Provider';
            }
        } catch (error) {
            console.error('Provider registration error:', error);
            showToast('Connection error with backend server.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Register as Service Provider';
        }
    });
}

/**
 * Booking JavaScript Module
 * Handles Service Request booking creation with validation and dynamic provider/service selection
 */

document.addEventListener('DOMContentLoaded', () => {
    initBookingPage();
});

async function initBookingPage() {
    const bookingForm = document.getElementById('service-booking-form');
    if (!bookingForm) return;

    // Check Authentication
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('customerName').value = currentUser.name || '';
        document.getElementById('customerPhone').value = currentUser.phone || '';
        document.getElementById('customerEmail').value = currentUser.email || '';
        if (currentUser.address) {
            document.getElementById('bookingAddress').value = currentUser.address;
        }
    }

    // Set default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedProviderId = urlParams.get('providerId');
    const preselectedServiceId = urlParams.get('serviceId');

    const providerSelect = document.getElementById('providerSelect');
    const serviceSelect = document.getElementById('serviceSelect');

    let allProviders = [];

    try {
        const resp = await fetch(`${API_BASE_URL}/providers`);
        const pData = await resp.json();
        if (pData.success && pData.data) {
            allProviders = pData.data;

            providerSelect.innerHTML = '<option value="">-- Choose a Service Provider --</option>' +
                allProviders.map(p => `
                    <option value="${p.id}" ${preselectedProviderId == p.id ? 'selected' : ''}>
                        ${p.businessName} (${p.categoryName} - ${p.city}) - from ${formatCurrency(p.startingPrice)}
                    </option>
                `).join('');

            updateServicesDropdown();
        }
    } catch (e) {
        console.warn('Backend offline, using fallback providers for booking dropdown:', e);
        if (typeof FALLBACK_PROVIDERS !== 'undefined') {
            allProviders = FALLBACK_PROVIDERS;
            providerSelect.innerHTML = '<option value="">-- Choose a Service Provider --</option>' +
                allProviders.map(p => `
                    <option value="${p.id}" ${preselectedProviderId == p.id ? 'selected' : ''}>
                        ${p.businessName} (${p.categoryName} - ${p.city}) - from ${formatCurrency(p.startingPrice)}
                    </option>
                `).join('');
            updateServicesDropdown();
        }
    }


    function updateServicesDropdown() {
        const selectedProvId = providerSelect.value;
        if (!selectedProvId) {
            serviceSelect.innerHTML = '<option value="">-- First select a provider --</option>';
            return;
        }

        const provider = allProviders.find(p => p.id == selectedProvId);
        if (provider && provider.services && provider.services.length > 0) {
            serviceSelect.innerHTML = '<option value="">-- Select Specific Service --</option>' +
                provider.services.map(s => `
                    <option value="${s.id}" ${preselectedServiceId == s.id ? 'selected' : ''}>
                        ${s.serviceName} - ${formatCurrency(s.price)}
                    </option>
                `).join('');
        } else {
            serviceSelect.innerHTML = '<option value="">Standard On-Site Diagnostic & Repair (Base Rate)</option>';
        }
    }

    providerSelect.addEventListener('change', updateServicesDropdown);

    // Form Submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = getCurrentUser();
        if (!user) {
            showToast('Please login first to submit a booking request.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return;
        }

        const providerId = providerSelect.value;
        const serviceId = serviceSelect.value;
        const bookingDate = document.getElementById('bookingDate').value;
        const bookingTime = document.getElementById('bookingTime').value;
        const address = document.getElementById('bookingAddress').value.trim();
        const description = document.getElementById('bookingDescription').value.trim();
        const submitBtn = document.getElementById('booking-submit-btn');

        if (!providerId || !bookingDate || !bookingTime || !address) {
            showToast('Please fill all mandatory booking fields.', 'warning');
            return;
        }

        // Determine service ID (if empty, grab the first service of the provider or fallback)
        let resolvedServiceId = serviceId;
        if (!resolvedServiceId) {
            const prov = allProviders.find(p => p.id == providerId);
            if (prov && prov.services && prov.services.length > 0) {
                resolvedServiceId = prov.services[0].id;
            } else {
                resolvedServiceId = 1; // Fallback
            }
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';

            const payload = {
                customerId: user.id,
                providerId: parseInt(providerId, 10),
                serviceId: parseInt(resolvedServiceId, 10),
                bookingDate: bookingDate,
                bookingTime: bookingTime,
                address: address,
                description: description
            };

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const booking = result.data;
                const bookingCard = document.getElementById('booking-card-body');
                bookingCard.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1.5rem;">
                            <i class="fas fa-check"></i>
                        </div>
                        <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem; color: var(--secondary);">Request Submitted!</h2>
                        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.5rem;">
                            Your service request has been submitted successfully.
                        </p>
                        <div style="background: var(--bg-alt); padding: 1.25rem; border-radius: var(--radius-md); max-width: 400px; margin: 0 auto 2rem; text-align: left;">
                            <p style="margin-bottom: 0.4rem;"><strong>Booking ID:</strong> <span class="badge badge-primary">#LSF-${booking.id}</span></p>
                            <p style="margin-bottom: 0.4rem;"><strong>Scheduled Date:</strong> ${booking.bookingDate} at ${booking.bookingTime}</p>
                            <p style="margin-bottom: 0.4rem;"><strong>Status:</strong> <span class="badge badge-warning">PENDING</span></p>
                            <p><strong>Address:</strong> ${booking.address}</p>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 1rem;">
                            <a href="customer-dashboard.html" class="btn btn-primary">Go to My Bookings</a>
                            <a href="providers.html" class="btn btn-outline">Find More Services</a>
                        </div>
                    </div>
                `;
            } else {
                showToast(result.message || 'Failed to submit booking.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Request Service';
            }
        } catch (error) {
            console.warn('Backend offline, showing demo booking confirmation:', error);
            const bookingCard = document.getElementById('booking-card-body');
            bookingCard.innerHTML = `
                <div style="text-align: center; padding: 2rem 1rem;">
                    <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1.5rem;">
                        <i class="fas fa-check"></i>
                    </div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem; color: var(--secondary);">Request Submitted!</h2>
                    <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.5rem;">
                        Your service request has been submitted successfully.
                    </p>
                    <div style="background: var(--bg-alt); padding: 1.25rem; border-radius: var(--radius-md); max-width: 400px; margin: 0 auto 2rem; text-align: left;">
                        <p style="margin-bottom: 0.4rem;"><strong>Booking ID:</strong> <span class="badge badge-primary">#LSF-8899 (Demo)</span></p>
                        <p style="margin-bottom: 0.4rem;"><strong>Scheduled Date:</strong> ${bookingDate} at ${bookingTime}</p>
                        <p style="margin-bottom: 0.4rem;"><strong>Status:</strong> <span class="badge badge-warning">PENDING</span></p>
                        <p><strong>Address:</strong> ${address}</p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 1rem;">
                        <a href="customer-dashboard.html" class="btn btn-primary">Go to My Bookings</a>
                        <a href="providers.html" class="btn btn-outline">Find More Services</a>
                    </div>
                </div>
            `;
        }

    });
}

/**
 * Providers JavaScript Module
 * Handles Provider Search, Multi-Criteria Filtering, and Provider Details Display
 */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('providers-grid-container')) {
        initProvidersDirectory();
    }
    if (document.getElementById('provider-details-container')) {
        loadProviderDetails();
    }
});

// ==========================================================================
// 1. Provider Directory & Search / Filter
// ==========================================================================
async function initProvidersDirectory() {
    const gridContainer = document.getElementById('providers-grid-container');
    const resultsCount = document.getElementById('results-count');
    const filterCategory = document.getElementById('filter-category');
    const filterCity = document.getElementById('filter-city');
    const filterRating = document.getElementById('filter-rating');
    const filterSort = document.getElementById('filter-sort');
    const filterMaxPrice = document.getElementById('filter-max-price');
    const priceDisplay = document.getElementById('price-val-display');

    // Load category options into filter dropdown
    if (filterCategory) {
        try {
            const resp = await fetch(`${API_BASE_URL}/services`);
            const data = await resp.json();
            if (data.success && data.data) {
                filterCategory.innerHTML = '<option value="">All Categories</option>' +
                    data.data.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
            }
        } catch (e) {
            console.warn('Failed loading categories for filter:', e);
        }
    }

    // Read URL query params (e.g. ?category=Plumbing&city=Chennai)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category') && filterCategory) {
        filterCategory.value = urlParams.get('category');
    }
    if (urlParams.get('city') && filterCity) {
        filterCity.value = urlParams.get('city');
    }

    async function executeSearch() {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
                <p style="margin-top: 0.75rem; color: var(--text-muted);">Finding top local providers...</p>
            </div>
        `;

        const categoryVal = filterCategory ? filterCategory.value : '';
        const cityVal = filterCity ? filterCity.value : '';
        const minRatingVal = filterRating ? filterRating.value : '';
        const sortByVal = filterSort ? filterSort.value : 'rating_desc';
        const maxPriceVal = filterMaxPrice ? filterMaxPrice.value : '';

        const params = new URLSearchParams();
        if (categoryVal) params.append('category', categoryVal);
        if (cityVal) params.append('city', cityVal);
        if (minRatingVal) params.append('minRating', minRatingVal);
        if (maxPriceVal && maxPriceVal < 5000) params.append('maxPrice', maxPriceVal);
        if (sortByVal) params.append('sortBy', sortByVal);

        try {
            const response = await fetch(`${API_BASE_URL}/providers/search?${params.toString()}`);
            const result = await response.json();

            if (result.success && result.data) {
                const providers = result.data;
                if (resultsCount) {
                    resultsCount.textContent = `Showing ${providers.length} ${providers.length === 1 ? 'provider' : 'providers'}`;
                }

                if (providers.length === 0) {
                    gridContainer.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                            <i class="fas fa-search fa-3x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                            <h3>No Providers Found</h3>
                            <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search criteria or resetting filters.</p>
                            <button onclick="resetFilters()" class="btn btn-outline-primary btn-sm" style="margin-top: 1rem;">Reset Filters</button>
                        </div>
                    `;
                    return;
                }

                gridContainer.innerHTML = providers.map(p => renderProviderCard(p)).join('');
            }
        } catch (error) {
            console.warn('Backend offline, filtering fallback demo providers:', error);
            if (typeof FALLBACK_PROVIDERS !== 'undefined') {
                let list = [...FALLBACK_PROVIDERS];
                if (categoryVal) {
                    list = list.filter(p => p.categoryName.toLowerCase().includes(categoryVal.toLowerCase()));
                }
                if (cityVal) {
                    list = list.filter(p => p.city.toLowerCase() === cityVal.toLowerCase());
                }
                if (minRatingVal) {
                    list = list.filter(p => p.rating >= parseFloat(minRatingVal));
                }
                if (maxPriceVal && maxPriceVal < 5000) {
                    list = list.filter(p => p.startingPrice <= parseFloat(maxPriceVal));
                }
                if (sortByVal === 'price_asc') {
                    list.sort((a, b) => a.startingPrice - b.startingPrice);
                } else if (sortByVal === 'price_desc') {
                    list.sort((a, b) => b.startingPrice - a.startingPrice);
                } else if (sortByVal === 'rating_desc') {
                    list.sort((a, b) => b.rating - a.rating);
                } else if (sortByVal === 'experience_desc') {
                    list.sort((a, b) => b.experience - a.experience);
                }

                if (resultsCount) {
                    resultsCount.textContent = `Showing ${list.length} ${list.length === 1 ? 'provider' : 'providers'} (Demo Mode)`;
                }

                if (list.length === 0) {
                    gridContainer.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                            <i class="fas fa-search fa-3x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                            <h3>No Providers Found</h3>
                            <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search criteria or resetting filters.</p>
                            <button onclick="resetFilters()" class="btn btn-outline-primary btn-sm" style="margin-top: 1rem;">Reset Filters</button>
                        </div>
                    `;
                } else {
                    gridContainer.innerHTML = list.map(p => renderProviderCard(p)).join('');
                }
            } else {
                gridContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                        <p style="margin-top: 0.5rem;">Failed to connect to backend server. Make sure Spring Boot is running.</p>
                    </div>
                `;
            }
        }
    }

    // Attach filter event listeners
    if (filterCategory) filterCategory.addEventListener('change', executeSearch);
    if (filterCity) filterCity.addEventListener('change', executeSearch);
    if (filterRating) filterRating.addEventListener('change', executeSearch);
    if (filterSort) filterSort.addEventListener('change', executeSearch);
    if (filterMaxPrice) {
        filterMaxPrice.addEventListener('input', (e) => {
            if (priceDisplay) priceDisplay.textContent = `₹${e.target.value}`;
        });
        filterMaxPrice.addEventListener('change', executeSearch);
    }

    window.resetFilters = function() {
        if (filterCategory) filterCategory.value = '';
        if (filterCity) filterCity.value = '';
        if (filterRating) filterRating.value = '';
        if (filterSort) filterSort.value = 'rating_desc';
        if (filterMaxPrice) {
            filterMaxPrice.value = 5000;
            if (priceDisplay) priceDisplay.textContent = '₹5000';
        }
        executeSearch();
    };

    // Initial search
    executeSearch();
}

function renderProviderCard(p) {
    const initials = p.businessName.substring(0, 2).toUpperCase();
    const ratingDisplay = p.rating > 0 ? p.rating.toFixed(1) : 'New';
    const reviewsText = p.reviewsCount > 0 ? `(${p.reviewsCount} reviews)` : '(0 reviews)';

    return `
        <div class="provider-card">
            <div class="provider-card-header">
                <div class="prov-avatar">${initials}</div>
                <div class="prov-header-info">
                    <h3 class="prov-business-name">
                        ${p.businessName}
                        ${p.verified ? '<i class="fas fa-check-circle prov-verified-badge" title="Verified Provider"></i>' : ''}
                    </h3>
                    <div class="prov-person-name"><i class="fas fa-user"></i> ${p.name || 'Professional'}</div>
                </div>
            </div>
            <div class="prov-card-body">
                <div class="prov-meta-row">
                    <span class="prov-category"><i class="fas fa-tag"></i> ${p.categoryName || 'Service'}</span>
                    <span class="prov-location"><i class="fas fa-map-marker-alt"></i> ${p.city}</span>
                </div>
                <div class="prov-meta-row">
                    <div class="stars-rating">
                        <i class="fas fa-star"></i>
                        <strong style="color: var(--secondary);">${ratingDisplay}</strong>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">${reviewsText}</span>
                    </div>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">
                        <i class="fas fa-briefcase"></i> ${p.experience} yrs exp
                    </span>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${p.description || 'Experienced local service specialist dedicated to high quality work.'}
                </p>
                <div class="prov-badge-row">
                    <span class="badge badge-success"><i class="fas fa-clock"></i> ${p.availability || 'Available Today'}</span>
                    <span class="badge badge-primary"><i class="fas fa-shield-alt"></i> Guaranteed</span>
                </div>
            </div>
            <div class="prov-card-footer">
                <div class="prov-price">
                    <span class="prov-price-label">Starts at</span>
                    <span class="prov-price-amount">${formatCurrency(p.startingPrice)}</span>
                </div>
                <div style="display: flex; gap: 0.4rem;">
                    <a href="provider-details.html?id=${p.id}" class="btn btn-outline btn-sm">View Profile</a>
                    <a href="booking.html?providerId=${p.id}" class="btn btn-primary btn-sm">Book Service</a>
                    <button onclick="openContactModal('${p.name}', '${p.phone}', '${p.email}')" class="btn btn-outline btn-sm" title="Contact Info">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
// 2. Provider Details Page Loader
// ==========================================================================
async function loadProviderDetails() {
    const container = document.getElementById('provider-details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('id');

    if (!providerId) {
        container.innerHTML = `<p style="padding: 2rem; text-align: center;">No provider ID specified.</p>`;
        return;
    }

    try {
        const [provResp, revResp] = await Promise.all([
            fetch(`${API_BASE_URL}/providers/${providerId}`),
            fetch(`${API_BASE_URL}/reviews/provider/${providerId}`)
        ]);

        const pData = await provResp.json();
        const rData = await revResp.json();

        if (pData.success && pData.data) {
            const p = pData.data;
            const reviews = (rData.success && rData.data) ? rData.data : [];

            document.getElementById('details-business-name').textContent = p.businessName;
            document.getElementById('details-person-name').textContent = `Operated by ${p.name}`;
            document.getElementById('details-category').innerHTML = `<i class="fas fa-tag"></i> ${p.categoryName}`;
            document.getElementById('details-city').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.city}`;
            document.getElementById('details-rating').innerHTML = `
                <i class="fas fa-star" style="color: #f59e0b;"></i> ${p.rating > 0 ? p.rating.toFixed(1) : 'New'} (${p.reviewsCount} reviews)
            `;
            document.getElementById('details-experience').textContent = `${p.experience} Years in Business`;
            document.getElementById('details-about').textContent = p.description || 'Experienced professional offering guaranteed work.';
            document.getElementById('details-price').textContent = formatCurrency(p.startingPrice);
            document.getElementById('details-hours').textContent = p.workingHours || '9:00 AM - 7:00 PM';
            document.getElementById('details-availability').textContent = p.availability || 'Available Today';
            document.getElementById('details-address').textContent = p.address;

            // Setup CTA buttons
            const bookBtn = document.getElementById('details-book-btn');
            if (bookBtn) {
                bookBtn.href = `booking.html?providerId=${p.id}`;
            }

            const contactBtn = document.getElementById('details-contact-btn');
            if (contactBtn) {
                contactBtn.onclick = () => openContactModal(p.name, p.phone, p.email);
            }

            // Render Services Offered
            const servicesContainer = document.getElementById('provider-services-list');
            if (servicesContainer) {
                if (p.services && p.services.length > 0) {
                    servicesContainer.innerHTML = p.services.map(s => `
                        <div class="service-item-row">
                            <div>
                                <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">${s.serviceName}</h4>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">${s.description || 'Standard high quality service.'}</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="font-size: 1.1rem; font-weight: 700; color: var(--secondary);">${formatCurrency(s.price)}</span>
                                <a href="booking.html?providerId=${p.id}&serviceId=${s.id}" class="btn btn-outline-primary btn-sm">Book This</a>
                            </div>
                        </div>
                    `).join('');
                } else {
                    servicesContainer.innerHTML = `
                        <div class="service-item-row">
                            <div>
                                <h4 style="font-size: 1rem;">Standard Consultation & Initial Inspection</h4>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Inspection, diagnostic, and initial repair plan.</p>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="font-size: 1.1rem; font-weight: 700; color: var(--secondary);">${formatCurrency(p.startingPrice)}</span>
                                <a href="booking.html?providerId=${p.id}" class="btn btn-outline-primary btn-sm">Book</a>
                            </div>
                        </div>
                    `;
                }
            }

            // Render Reviews
            const reviewsContainer = document.getElementById('provider-reviews-list');
            if (reviewsContainer) {
                if (reviews.length > 0) {
                    reviewsContainer.innerHTML = reviews.map(r => `
                        <div class="review-card">
                            <div class="review-header">
                                <strong>${r.customer ? r.customer.name : 'Verified Customer'}</strong>
                                <div class="stars-rating">
                                    ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                                </div>
                            </div>
                            <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.4rem;">${r.comment}</p>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(r.createdAt)}</span>
                        </div>
                    `).join('');
                } else {
                    reviewsContainer.innerHTML = `<p style="color: var(--text-muted);">No reviews written yet. Be the first to book and review!</p>`;
                }
            }
        }
    } catch (e) {
        console.warn('Backend offline, loading fallback provider details:', e);
        if (typeof FALLBACK_PROVIDERS !== 'undefined') {
            const p = FALLBACK_PROVIDERS.find(item => item.id == providerId) || FALLBACK_PROVIDERS[0];
            document.getElementById('details-business-name').textContent = p.businessName;
            document.getElementById('details-person-name').textContent = `Operated by ${p.name}`;
            document.getElementById('details-category').innerHTML = `<i class="fas fa-tag"></i> ${p.categoryName}`;
            document.getElementById('details-city').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.city}`;
            document.getElementById('details-rating').innerHTML = `
                <i class="fas fa-star" style="color: #f59e0b;"></i> ${p.rating > 0 ? p.rating.toFixed(1) : 'New'} (${p.reviewsCount} reviews)
            `;
            document.getElementById('details-experience').textContent = `${p.experience} Years in Business`;
            document.getElementById('details-about').textContent = p.description || 'Experienced professional offering guaranteed work.';
            document.getElementById('details-price').textContent = formatCurrency(p.startingPrice);
            document.getElementById('details-hours').textContent = p.workingHours || '9:00 AM - 7:00 PM';
            document.getElementById('details-availability').textContent = p.availability || 'Available Today';
            document.getElementById('details-address').textContent = p.address;

            const bookBtn = document.getElementById('details-book-btn');
            if (bookBtn) bookBtn.href = `booking.html?providerId=${p.id}`;

            const contactBtn = document.getElementById('details-contact-btn');
            if (contactBtn) contactBtn.onclick = () => openContactModal(p.name, p.phone, p.email);

            const servicesContainer = document.getElementById('provider-services-list');
            if (servicesContainer && p.services) {
                servicesContainer.innerHTML = p.services.map(s => `
                    <div class="service-item-row">
                        <div>
                            <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">${s.serviceName}</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">${s.description || 'Standard high quality service.'}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span style="font-size: 1.1rem; font-weight: 700; color: var(--secondary);">${formatCurrency(s.price)}</span>
                            <a href="booking.html?providerId=${p.id}&serviceId=${s.id}" class="btn btn-outline-primary btn-sm">Book This</a>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
}


// Quick Contact Modal
window.openContactModal = function(name, phone, email) {
    let modal = document.getElementById('contact-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contact-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>Contact Service Provider</h3>
                    <button onclick="document.getElementById('contact-modal').style.display='none'" style="background:none;border:none;font-size:1.25rem;cursor:pointer;">&times;</button>
                </div>
                <div class="modal-body" id="contact-modal-body"></div>
                <div class="modal-footer">
                    <button onclick="document.getElementById('contact-modal').style.display='none'" class="btn btn-outline btn-sm">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('contact-modal-body').innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
            <div class="prov-avatar" style="margin: 0 auto 1rem; width: 60px; height: 60px; font-size: 1.5rem;">
                <i class="fas fa-user-tie"></i>
            </div>
            <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${name}</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">Reach out directly for queries, estimates, and immediate questions.</p>
            <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-md); text-align: left; display: flex; flex-direction: column; gap: 0.75rem;">
                <div><i class="fas fa-phone" style="color: var(--primary); width: 20px;"></i> <strong>Phone:</strong> <a href="tel:${phone}">${phone || '9840123456'}</a></div>
                <div><i class="fas fa-envelope" style="color: var(--primary); width: 20px;"></i> <strong>Email:</strong> <a href="mailto:${email}">${email || 'contact@provider.com'}</a></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

/**
 * Services JavaScript Module
 * Fetches all service categories from Spring Boot REST API and renders them as cards
 */

document.addEventListener('DOMContentLoaded', () => {
    loadServicesPage();
});

async function loadServicesPage() {
    const servicesGrid = document.getElementById('services-category-grid');
    if (!servicesGrid) return;

    try {
        servicesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
                <p style="margin-top: 0.75rem; color: var(--text-muted);">Loading service categories...</p>
            </div>
        `;

        // Fetch categories and providers in parallel
        const [catResp, provResp] = await Promise.all([
            fetch(`${API_BASE_URL}/services`),
            fetch(`${API_BASE_URL}/providers`)
        ]);

        const catData = await catResp.json();
        const provData = await provResp.json();

        if (catData.success && catData.data) {
            const categories = catData.data;
            const providers = (provData.success && provData.data) ? provData.data : [];

            // Compute provider counts per category
            const countMap = {};
            providers.forEach(p => {
                const cId = p.categoryId;
                countMap[cId] = (countMap[cId] || 0) + 1;
            });

            if (categories.length === 0) {
                servicesGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <p>No service categories found.</p>
                    </div>
                `;
                return;
            }

            servicesGrid.innerHTML = categories.map(cat => {
                const count = countMap[cat.id] || 0;
                const icon = cat.icon || 'fa-tools';
                return `
                    <div class="category-card">
                        <div class="cat-icon-wrap">
                            <i class="fas ${icon}"></i>
                        </div>
                        <h3 class="cat-name">${cat.name}</h3>
                        <p class="cat-desc">${cat.description}</p>
                        <div class="cat-meta">
                            <i class="fas fa-user-check"></i> ${count} Verified ${count === 1 ? 'Provider' : 'Providers'}
                        </div>
                        <a href="providers.html?category=${encodeURIComponent(cat.name)}" class="btn btn-outline-primary btn-sm btn-block">
                            Find ${cat.name}s <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.warn('Backend offline, using fallback categories dataset:', error);
        // Seamless fallback to demo categories
        if (typeof FALLBACK_CATEGORIES !== 'undefined') {
            servicesGrid.innerHTML = FALLBACK_CATEGORIES.map(cat => `
                <div class="category-card">
                    <div class="cat-icon-wrap">
                        <i class="fas ${cat.icon || 'fa-tools'}"></i>
                    </div>
                    <h3 class="cat-name">${cat.name}</h3>
                    <p class="cat-desc">${cat.description}</p>
                    <div class="cat-meta">
                        <i class="fas fa-user-check"></i> Verified Professionals
                    </div>
                    <a href="providers.html?category=${encodeURIComponent(cat.name)}" class="btn btn-outline-primary btn-sm btn-block">
                        Find ${cat.name}s <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `).join('');
        } else {
            servicesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle fa-2x"></i>
                    <p style="margin-top: 0.5rem;">Could not load categories from backend. Make sure the Spring Boot server is running on port 8080.</p>
                </div>
            `;
        }
    }
}


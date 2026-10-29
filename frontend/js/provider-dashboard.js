/**
 * Provider Dashboard JavaScript Module
 * Handles Provider service requests, acceptance, completion, adding services, and viewing ratings
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['PROVIDER', 'ADMIN'])) return;
    initProviderDashboard();
});

async function initProviderDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // Display provider names
    const provNameEls = document.querySelectorAll('.provider-business-placeholder');
    provNameEls.forEach(el => el.textContent = user.name);

    const userEmailEls = document.querySelectorAll('.provider-email-placeholder');
    userEmailEls.forEach(el => el.textContent = user.email);

    let providerId = user.providerId;

    // If providerId not directly in user object, look it up
    if (!providerId) {
        try {
            const resp = await fetch(`${API_BASE_URL}/providers`);
            const data = await resp.json();
            if (data.success && data.data) {
                const prov = data.data.find(p => p.userId === user.id || p.email === user.email);
                if (prov) {
                    providerId = prov.id;
                    user.providerId = prov.id;
                    setCurrentUser(user);
                }
            }
        } catch (e) {
            console.warn('Could not resolve provider ID:', e);
        }
    }

    if (!providerId) {
        providerId = 1; // Fallback demo provider
    }

    await loadProviderStats(providerId);
    await loadProviderRequests(providerId);
    initAddServiceModal(providerId);
}

async function loadProviderStats(providerId) {
    try {
        const resp = await fetch(`${API_BASE_URL}/admin/stats/provider/${providerId}`);
        const result = await resp.json();

        if (result.success && result.data) {
            const s = result.data;
            document.getElementById('stat-total-requests').textContent = s.totalBookings || 0;
            document.getElementById('stat-pending-requests').textContent = s.pendingBookings || 0;
            document.getElementById('stat-completed-jobs').textContent = s.completedBookings || 0;
            document.getElementById('stat-avg-rating').textContent = s.averageRating > 0 ? s.averageRating.toFixed(1) : '5.0';
        }
    } catch (e) {
        console.warn('Could not load provider stats:', e);
    }
}

async function loadProviderRequests(providerId) {
    const tbody = document.getElementById('provider-requests-tbody');
    if (!tbody) return;

    try {
        const resp = await fetch(`${API_BASE_URL}/bookings/provider/${providerId}`);
        const result = await resp.json();

        if (result.success && result.data) {
            const bookings = result.data;

            if (bookings.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                            <i class="fas fa-inbox fa-2x" style="margin-bottom: 0.5rem; display: block; color: var(--text-light);"></i>
                            No incoming service requests at the moment.
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = bookings.map(b => {
                let badgeClass = 'badge-warning';
                if (b.status === 'ACCEPTED') badgeClass = 'badge-primary';
                if (b.status === 'COMPLETED') badgeClass = 'badge-success';
                if (b.status === 'CANCELLED' || b.status === 'REJECTED') badgeClass = 'badge-danger';

                let actionButtons = '';
                if (b.status === 'PENDING') {
                    actionButtons = `
                        <div style="display: flex; gap: 0.35rem;">
                            <button onclick="updateStatus(${b.id}, 'ACCEPTED')" class="btn btn-success btn-sm" title="Accept Request">
                                <i class="fas fa-check"></i> Accept
                            </button>
                            <button onclick="updateStatus(${b.id}, 'REJECTED')" class="btn btn-danger btn-sm" title="Reject Request">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    `;
                } else if (b.status === 'ACCEPTED') {
                    actionButtons = `
                        <button onclick="updateStatus(${b.id}, 'COMPLETED')" class="btn btn-primary btn-sm">
                            <i class="fas fa-check-double"></i> Mark Completed
                        </button>
                    `;
                } else {
                    actionButtons = `<span style="color: var(--text-muted); font-size: 0.85rem;">No actions</span>`;
                }

                return `
                    <tr>
                        <td><strong>#LSF-${b.id}</strong></td>
                        <td>
                            <strong>${b.customer ? b.customer.name : 'Customer'}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-phone"></i> ${b.customer ? b.customer.phone : ''}</div>
                        </td>
                        <td>
                            <strong>${b.service ? b.service.serviceName : 'Service'}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${formatCurrency(b.service ? b.service.price : 0)}</div>
                        </td>
                        <td>
                            <div>${formatDate(b.bookingDate)}</div>
                            <small style="color: var(--text-muted);">${b.bookingTime}</small>
                        </td>
                        <td style="max-width: 220px; font-size: 0.85rem;">${b.address}</td>
                        <td><span class="badge ${badgeClass}">${b.status}</span></td>
                        <td>${actionButtons}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        console.warn('Backend offline, showing demo provider requests:', e);
        tbody.innerHTML = `
            <tr>
                <td><strong>#LSF-201</strong></td>
                <td>
                    <strong>Rahul Sharma</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-phone"></i> 9840123456</div>
                </td>
                <td>
                    <strong>Ceiling Fan Installation</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">₹299</div>
                </td>
                <td>
                    <div>Today</div>
                    <small style="color: var(--text-muted);">10:00 AM</small>
                </td>
                <td style="max-width: 220px; font-size: 0.85rem;">Flat 4B, Emerald Court, Velachery, Chennai</td>
                <td><span class="badge badge-warning">PENDING</span></td>
                <td>
                    <div style="display: flex; gap: 0.35rem;">
                        <button onclick="showToast('Demo request accepted!', 'success')" class="btn btn-success btn-sm">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        <button onclick="showToast('Demo request rejected', 'info')" class="btn btn-danger btn-sm">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </td>
            </tr>
            <tr>
                <td><strong>#LSF-202</strong></td>
                <td>
                    <strong>Priya Sundaram</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-phone"></i> 9840987654</div>
                </td>
                <td>
                    <strong>MCB Tripping Fix</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">₹449</div>
                </td>
                <td>
                    <div>Tomorrow</div>
                    <small style="color: var(--text-muted);">04:00 PM</small>
                </td>
                <td style="max-width: 220px; font-size: 0.85rem;">12th Cross, Indiranagar, Bangalore</td>
                <td><span class="badge badge-primary">ACCEPTED</span></td>
                <td>
                    <button onclick="showToast('Demo job marked completed!', 'success')" class="btn btn-primary btn-sm">
                        <i class="fas fa-check-double"></i> Mark Completed
                    </button>
                </td>
            </tr>
        `;
        document.getElementById('stat-total-requests').textContent = '2';
        document.getElementById('stat-pending-requests').textContent = '1';
        document.getElementById('stat-completed-jobs').textContent = '4';
        document.getElementById('stat-avg-rating').textContent = '4.8';
    }
}


// Update Booking Status API Call
window.updateStatus = async function(bookingId, newStatus) {
    try {
        const resp = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await resp.json();

        if (resp.ok && result.success) {
            showToast(`Booking status updated to ${newStatus}`, 'success');
            const user = getCurrentUser();
            const pId = user.providerId || 1;
            loadProviderRequests(pId);
            loadProviderStats(pId);
        } else {
            showToast(result.message || 'Failed to update status', 'error');
        }
    } catch (e) {
        showToast('Error communicating with server', 'error');
    }
};

// Add Service Modal
function initAddServiceModal(providerId) {
    const addBtn = document.getElementById('open-add-service-btn');
    if (!addBtn) return;

    addBtn.onclick = () => {
        let modal = document.getElementById('add-service-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'add-service-modal';
            modal.className = 'modal-backdrop';
            modal.innerHTML = `
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>Add New Service Item</h3>
                        <button onclick="document.getElementById('add-service-modal').style.display='none'" style="background:none;border:none;font-size:1.25rem;cursor:pointer;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Service Title</label>
                            <input type="text" id="new-service-name" class="form-control" placeholder="e.g. Copper Pipe Brazing & Gas Leak Test" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select id="new-service-cat" class="form-control"></select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Price (₹ INR)</label>
                            <input type="number" id="new-service-price" class="form-control" placeholder="499" min="1" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea id="new-service-desc" class="form-control" placeholder="Brief scope of what is included in this service..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="document.getElementById('add-service-modal').style.display='none'" class="btn btn-outline btn-sm">Cancel</button>
                        <button id="new-service-submit-btn" class="btn btn-primary btn-sm">Save Service</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Populate categories
            fetch(`${API_BASE_URL}/services`)
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.data) {
                        document.getElementById('new-service-cat').innerHTML = data.data.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
                    }
                });
        }

        const saveBtn = document.getElementById('new-service-submit-btn');
        saveBtn.onclick = async () => {
            const serviceName = document.getElementById('new-service-name').value.trim();
            const categoryId = document.getElementById('new-service-cat').value;
            const price = parseFloat(document.getElementById('new-service-price').value);
            const description = document.getElementById('new-service-desc').value.trim();

            if (!serviceName || !categoryId || isNaN(price)) {
                showToast('Please enter title, category and valid price', 'warning');
                return;
            }

            try {
                saveBtn.disabled = true;
                const resp = await fetch(`${API_BASE_URL}/providers/${providerId}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ categoryId, serviceName, description, price })
                });
                const res = await resp.json();

                if (resp.ok && res.success) {
                    showToast('Service added successfully!', 'success');
                    modal.style.display = 'none';
                } else {
                    showToast(res.message || 'Failed to add service', 'error');
                }
            } catch (e) {
                showToast('Server communication error', 'error');
            } finally {
                saveBtn.disabled = false;
            }
        };

        modal.style.display = 'flex';
    };
}

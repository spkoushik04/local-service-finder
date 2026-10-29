/**
 * Admin Dashboard JavaScript Module
 * Handles platform metrics, user management, provider approvals/rejections, and category CRUD
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['ADMIN'])) return;
    initAdminDashboard();
});

async function initAdminDashboard() {
    setupAdminTabs();
    updateAdminProfileUI();
    await loadAdminStats();
    await loadAdminProviders();
    await loadAdminUsers();
    await loadAdminCategories();
}

function updateAdminProfileUI() {
    const user = getCurrentUser();
    if (user) {
        const nameEl = document.querySelector('.sidebar-user-name');
        const roleEl = document.querySelector('.sidebar-user-role');
        const avatarEl = document.querySelector('.sidebar-avatar');
        if (nameEl && user.name) nameEl.textContent = user.name;
        if (roleEl && user.email) roleEl.textContent = user.email;
        if (avatarEl && user.name) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    }
}

// Tab Switching
function setupAdminTabs() {
    const tabButtons = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-tab-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');

            tabButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.style.display = 'none');

            btn.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.style.display = 'block';
        });
    });
}

// 1. Stats
async function loadAdminStats() {
    try {
        const resp = await fetch(`${API_BASE_URL}/admin/stats`);
        const result = await resp.json();

        if (result.success && result.data) {
            const s = result.data;
            document.getElementById('admin-stat-users').textContent = s.totalUsers || 0;
            document.getElementById('admin-stat-providers').textContent = s.totalProviders || 0;
            document.getElementById('admin-stat-services').textContent = s.totalServices || 0;
            document.getElementById('admin-stat-bookings').textContent = s.totalBookings || 0;
            document.getElementById('admin-stat-pending-approvals').textContent = s.pendingApprovals || 0;
            document.getElementById('admin-stat-completed-bookings').textContent = s.completedBookings || 0;
        }
    } catch (e) {
        console.warn('Backend offline, setting fallback admin metrics:', e);
        document.getElementById('admin-stat-users').textContent = '12';
        document.getElementById('admin-stat-providers').textContent = '8';
        document.getElementById('admin-stat-services').textContent = '10';
        document.getElementById('admin-stat-bookings').textContent = '24';
        document.getElementById('admin-stat-pending-approvals').textContent = '1';
        document.getElementById('admin-stat-completed-bookings').textContent = '18';
    }
}


// 2. Providers & Approvals
async function loadAdminProviders() {
    const tbody = document.getElementById('admin-providers-tbody');
    if (!tbody) return;

    try {
        const resp = await fetch(`${API_BASE_URL}/admin/providers`);
        const result = await resp.json();

        if (result.success && result.data) {
            const providers = result.data;

            if (providers.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No providers found.</td></tr>`;
                return;
            }

            tbody.innerHTML = providers.map(p => {
                let badgeClass = 'badge-warning';
                if (p.status === 'APPROVED') badgeClass = 'badge-success';
                if (p.status === 'REJECTED') badgeClass = 'badge-danger';

                let actionBtns = '';
                if (p.status === 'PENDING') {
                    actionBtns = `
                        <button onclick="approveProvider(${p.id})" class="btn btn-success btn-sm">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="rejectProvider(${p.id})" class="btn btn-danger btn-sm">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    `;
                } else if (p.status === 'APPROVED') {
                    actionBtns = `
                        <button onclick="rejectProvider(${p.id})" class="btn btn-outline btn-sm" style="color: var(--danger);">
                            Revoke
                        </button>
                    `;
                } else {
                    actionBtns = `
                        <button onclick="approveProvider(${p.id})" class="btn btn-outline-primary btn-sm">
                            Re-Approve
                        </button>
                    `;
                }

                return `
                    <tr>
                        <td><strong>#${p.id}</strong></td>
                        <td>
                            <strong>${p.businessName}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${p.name} (${p.phone || p.email})</div>
                        </td>
                        <td>${p.categoryName}</td>
                        <td>${p.city}</td>
                        <td>${p.experience} yrs</td>
                        <td><span class="badge ${badgeClass}">${p.status}</span></td>
                        <td>${actionBtns}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        console.warn('Backend offline, showing demo providers in admin queue:', e);
        tbody.innerHTML = `
            <tr>
                <td><strong>#9</strong></td>
                <td>
                    <strong>Dinesh Express Plumbing</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Dinesh Kumar (9841999112)</div>
                </td>
                <td>Plumbing</td>
                <td>Chennai</td>
                <td>3 yrs</td>
                <td><span class="badge badge-warning" id="demo-prov-badge-9">PENDING</span></td>
                <td>
                    <div style="display: flex; gap: 0.35rem;">
                        <button onclick="document.getElementById('demo-prov-badge-9').className='badge badge-success'; document.getElementById('demo-prov-badge-9').textContent='APPROVED'; showToast('Provider approved and verified (Demo)!', 'success');" class="btn btn-success btn-sm">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="document.getElementById('demo-prov-badge-9').className='badge badge-danger'; document.getElementById('demo-prov-badge-9').textContent='REJECTED'; showToast('Provider rejected (Demo)', 'info');" class="btn btn-danger btn-sm">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </td>
            </tr>
            <tr>
                <td><strong>#1</strong></td>
                <td>
                    <strong>Suresh Super Electricals</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Suresh Kumar (9841122334)</div>
                </td>
                <td>Electrical</td>
                <td>Chennai</td>
                <td>8 yrs</td>
                <td><span class="badge badge-success">APPROVED</span></td>
                <td>
                    <button onclick="showToast('Status modified (Demo)', 'info')" class="btn btn-outline btn-sm" style="color: var(--danger);">
                        Revoke
                    </button>
                </td>
            </tr>
        `;
    }
}


window.approveProvider = async function(id) {
    try {
        const resp = await fetch(`${API_BASE_URL}/admin/providers/${id}/approve`, { method: 'PUT' });
        const res = await resp.json();
        if (resp.ok && res.success) {
            showToast('Provider approved and verified!', 'success');
            loadAdminProviders();
            loadAdminStats();
        } else {
            showToast(res.message || 'Approval failed', 'error');
        }
    } catch (e) {
        showToast('Server communication error', 'error');
    }
};

window.rejectProvider = async function(id) {
    if (!confirm('Are you sure you want to reject this provider application?')) return;
    try {
        const resp = await fetch(`${API_BASE_URL}/admin/providers/${id}/reject`, { method: 'PUT' });
        const res = await resp.json();
        if (resp.ok && res.success) {
            showToast('Provider rejected.', 'info');
            loadAdminProviders();
            loadAdminStats();
        } else {
            showToast(res.message || 'Action failed', 'error');
        }
    } catch (e) {
        showToast('Server communication error', 'error');
    }
};

// 3. User Management
async function loadAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    try {
        const resp = await fetch(`${API_BASE_URL}/admin/users`);
        const result = await resp.json();

        if (result.success && result.data) {
            const users = result.data;
            tbody.innerHTML = users.map(u => {
                let badgeClass = 'badge-primary';
                if (u.role === 'PROVIDER') badgeClass = 'badge-warning';
                if (u.role === 'ADMIN') badgeClass = 'badge-danger';

                return `
                    <tr>
                        <td><strong>#${u.id}</strong></td>
                        <td>
                            <strong>${u.name}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${u.email}</div>
                        </td>
                        <td>${u.phone}</td>
                        <td><span class="badge ${badgeClass}">${u.role}</span></td>
                        <td>${u.city}</td>
                        <td>${formatDate(u.createdAt)}</td>
                        <td>
                            ${u.role !== 'ADMIN' ? `
                                <button onclick="deleteUserAccount(${u.id}, '${u.name.replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);">
                                    <i class="fas fa-trash"></i> Suspend
                                </button>
                            ` : '<span style="color:var(--text-muted); font-size:0.8rem;">Protected</span>'}
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        console.warn('Backend offline, showing demo users in admin directory:', e);
        tbody.innerHTML = `
            <tr>
                <td><strong>#1</strong></td>
                <td>
                    <strong>Koushik S P</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">koushik@gmail.com</div>
                </td>
                <td>9876543210</td>
                <td><span class="badge badge-danger">ADMIN</span></td>
                <td>Chennai</td>
                <td>Today</td>
                <td><span style="color:var(--text-muted); font-size:0.8rem;">Protected</span></td>
            </tr>
            <tr>
                <td><strong>#17</strong></td>
                <td>
                    <strong>Barath S</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">barath@gmail.com</div>
                </td>
                <td>9876543211</td>
                <td><span class="badge badge-danger">ADMIN</span></td>
                <td>Chennai</td>
                <td>Today</td>
                <td><span style="color:var(--text-muted); font-size:0.8rem;">Protected</span></td>
            </tr>
            <tr>
                <td><strong>#2</strong></td>
                <td>
                    <strong>Rahul Sharma</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">rahul@example.com</div>
                </td>
                <td>9840123456</td>
                <td><span class="badge badge-primary">CUSTOMER</span></td>
                <td>Chennai</td>
                <td>Yesterday</td>
                <td>
                    <button onclick="showToast('User account suspended (Demo)', 'info')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);">
                        <i class="fas fa-trash"></i> Suspend
                    </button>
                </td>
            </tr>
            <tr>
                <td><strong>#4</strong></td>
                <td>
                    <strong>Suresh Kumar</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">suresh.electrical@example.com</div>
                </td>
                <td>9841122334</td>
                <td><span class="badge badge-warning">PROVIDER</span></td>
                <td>Chennai</td>
                <td>3 days ago</td>
                <td>
                    <button onclick="showToast('User account suspended (Demo)', 'info')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);">
                        <i class="fas fa-trash"></i> Suspend
                    </button>
                </td>
            </tr>
        `;
    }
}


window.deleteUserAccount = async function(id, name) {
    if (!confirm(`Are you sure you want to suspend user ${name}? This will remove associated records.`)) return;

    try {
        const resp = await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE' });
        const res = await resp.json();
        if (resp.ok && res.success) {
            showToast('User suspended successfully.', 'info');
            loadAdminUsers();
            loadAdminStats();
        } else {
            showToast(res.message || 'Failed to delete user', 'error');
        }
    } catch (e) {
        showToast('Server communication error', 'error');
    }
};

// 4. Categories Management
async function loadAdminCategories() {
    const tbody = document.getElementById('admin-categories-tbody');
    if (!tbody) return;

    try {
        const resp = await fetch(`${API_BASE_URL}/services`);
        const result = await resp.json();

        if (result.success && result.data) {
            const categories = result.data;
            tbody.innerHTML = categories.map(c => `
                <tr>
                    <td><strong>#${c.id}</strong></td>
                    <td><i class="fas ${c.icon || 'fa-tools'}" style="color: var(--primary); font-size: 1.2rem;"></i></td>
                    <td><strong>${c.name}</strong></td>
                    <td style="font-size: 0.85rem; color: var(--text-muted); max-width: 300px;">${c.description}</td>
                    <td>
                        <div style="display: flex; gap: 0.35rem;">
                            <button onclick="openEditCategoryModal(${c.id}, '${(c.name || '').replace(/'/g, "\\'")}', '${(c.icon || '').replace(/'/g, "\\'")}', '${(c.description || '').replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="deleteCategory(${c.id})" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.warn('Backend offline, showing demo categories in admin portal:', e);
        if (typeof FALLBACK_CATEGORIES !== 'undefined') {
            tbody.innerHTML = FALLBACK_CATEGORIES.map(c => `
                <tr>
                    <td><strong>#${c.id}</strong></td>
                    <td><i class="fas ${c.icon || 'fa-tools'}" style="color: var(--primary); font-size: 1.2rem;"></i></td>
                    <td><strong>${c.name}</strong></td>
                    <td style="font-size: 0.85rem; color: var(--text-muted); max-width: 300px;">${c.description}</td>
                    <td>
                        <div style="display: flex; gap: 0.35rem;">
                            <button onclick="showToast('Category edit demo', 'info')" class="btn btn-outline btn-sm">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="showToast('Category deleted (Demo)', 'info')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }
}


window.deleteCategory = async function(id) {
    if (!confirm('Are you sure you want to delete this category? Providers linked to it may be affected.')) return;
    try {
        const resp = await fetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' });
        const res = await resp.json();
        if (resp.ok && res.success) {
            showToast('Category deleted successfully.', 'info');
            loadAdminCategories();
            loadAdminStats();
        } else {
            showToast(res.message || 'Failed to delete category', 'error');
        }
    } catch (e) {
        showToast('Server communication error', 'error');
    }
};

// Edit Category Modal
window.openEditCategoryModal = function(id, currentName, currentIcon, currentDesc) {
    let modal = document.getElementById('edit-cat-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-cat-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>Edit Service Category <span id="edit-cat-id-badge" style="font-size: 0.9rem; color: var(--text-muted);"></span></h3>
                    <button onclick="document.getElementById('edit-cat-modal').style.display='none'" style="background:none;border:none;font-size:1.25rem;cursor:pointer;">&times;</button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="edit-cat-id" />
                    <div class="form-group">
                        <label class="form-label">Category Name (Max 20)</label>
                        <input type="text" id="edit-cat-name" class="form-control" maxlength="20" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">FontAwesome Icon Class</label>
                        <input type="text" id="edit-cat-icon" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description (Max 100)</label>
                        <textarea id="edit-cat-desc" class="form-control" maxlength="100" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="document.getElementById('edit-cat-modal').style.display='none'" class="btn btn-outline btn-sm">Cancel</button>
                    <button id="edit-cat-submit-btn" class="btn btn-primary btn-sm">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('edit-cat-id').value = id;
    document.getElementById('edit-cat-id-badge').textContent = `(#${id})`;
    document.getElementById('edit-cat-name').value = currentName || '';
    document.getElementById('edit-cat-icon').value = currentIcon || 'fa-tools';
    document.getElementById('edit-cat-desc').value = currentDesc || '';

    const saveBtn = document.getElementById('edit-cat-submit-btn');
    saveBtn.onclick = async () => {
        const name = document.getElementById('edit-cat-name').value.trim();
        const icon = document.getElementById('edit-cat-icon').value.trim();
        const description = document.getElementById('edit-cat-desc').value.trim();

        if (!name || !description) {
            showToast('Please fill all category fields.', 'warning');
            return;
        }

        try {
            saveBtn.disabled = true;
            const resp = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, icon, description })
            });
            const res = await resp.json();
            if (resp.ok && res.success) {
                showToast('Category updated successfully!', 'success');
                modal.style.display = 'none';
                loadAdminCategories();
            } else {
                showToast(res.message || 'Failed to update category', 'error');
            }
        } catch (e) {
            showToast('Server communication error', 'error');
        } finally {
            saveBtn.disabled = false;
        }
    };

    modal.style.display = 'flex';
};

// Add Category Modal
window.openAddCategoryModal = function() {
    let modal = document.getElementById('add-cat-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-cat-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>Add Service Category</h3>
                    <button onclick="document.getElementById('add-cat-modal').style.display='none'" style="background:none;border:none;font-size:1.25rem;cursor:pointer;">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Category Name (Max 20)</label>
                        <input type="text" id="new-cat-name" class="form-control" placeholder="e.g. Solar Cleaning" maxlength="20" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">FontAwesome Icon Class</label>
                        <input type="text" id="new-cat-icon" class="form-control" placeholder="e.g. fa-solar-panel" value="fa-tools" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description (Max 100)</label>
                        <textarea id="new-cat-desc" class="form-control" placeholder="Brief summary of services in this category..." maxlength="100"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="document.getElementById('add-cat-modal').style.display='none'" class="btn btn-outline btn-sm">Cancel</button>
                    <button id="add-cat-submit-btn" class="btn btn-primary btn-sm">Create Category</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const saveBtn = document.getElementById('add-cat-submit-btn');
    saveBtn.onclick = async () => {
        const name = document.getElementById('new-cat-name').value.trim();
        const icon = document.getElementById('new-cat-icon').value.trim();
        const description = document.getElementById('new-cat-desc').value.trim();

        if (!name || !description) {
            showToast('Please fill all category fields.', 'warning');
            return;
        }

        try {
            saveBtn.disabled = true;
            const resp = await fetch(`${API_BASE_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, icon, description })
            });
            const res = await resp.json();
            if (resp.ok && res.success) {
                showToast('Category created successfully!', 'success');
                modal.style.display = 'none';
                loadAdminCategories();
                loadAdminStats();
            } else {
                showToast(res.message || 'Failed to create category', 'error');
            }
        } catch (e) {
            showToast('Server communication error', 'error');
        } finally {
            saveBtn.disabled = false;
        }
    };

    modal.style.display = 'flex';
};

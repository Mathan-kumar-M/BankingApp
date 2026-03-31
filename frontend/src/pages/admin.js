// =============================================
// NexusBank — Admin Panel
// =============================================
import { getPendingUsers, approveUser, rejectUser, getAllUsers } from '../api.js';
import { showToast } from '../toast.js';

export function renderAdmin() {
    return `
    <div class="page-header">
      <h1>Admin Panel</h1>
      <p>Manage users and approvals</p>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab active" data-tab="pending">Pending Approvals</button>
      <button class="admin-tab" data-tab="all">All Users</button>
    </div>

    <div class="card" id="admin-content">
      <div class="spinner"></div>
    </div>
  `;
}

function getInitials(name) {
    return name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
}

function renderUserList(users, showActions) {
    if (users.length === 0) {
        return `
      <div class="empty-state">
        <span class="material-icons-round">group</span>
        <p>No users found</p>
      </div>
    `;
    }
    return users.map(u => `
    <div class="user-card" data-user-id="${u.id}">
      <div class="user-card-info">
        <div class="user-avatar-sm">${getInitials(u.name)}</div>
        <div class="user-card-details">
          <h3>${u.name}</h3>
          <p>${u.email} · <span class="badge ${u.status === 'APPROVED' ? 'badge-success' : u.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}">${u.status}</span>
          · <span class="badge ${u.role === 'ADMIN' ? 'badge-info' : 'badge-neutral'}">${u.role}</span></p>
        </div>
      </div>
      ${showActions ? `
        <div class="user-card-actions">
          <button class="btn btn-sm btn-success approve-btn" data-id="${u.id}">
            <span class="material-icons-round" style="font-size:16px;">check</span> Approve
          </button>
          <button class="btn btn-sm btn-danger reject-btn" data-id="${u.id}">
            <span class="material-icons-round" style="font-size:16px;">close</span> Reject
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

async function loadPending(container) {
    container.innerHTML = '<div class="spinner"></div>';
    try {
        const users = await getPendingUsers();
        container.innerHTML = renderUserList(users, true);
        bindActions(container);
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><span class="material-icons-round">error</span><p>${err.message}</p></div>`;
    }
}

async function loadAll(container) {
    container.innerHTML = '<div class="spinner"></div>';
    try {
        const users = await getAllUsers();
        container.innerHTML = renderUserList(users, false);
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><span class="material-icons-round">error</span><p>${err.message}</p></div>`;
    }
}

function bindActions(container) {
    container.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            btn.disabled = true;
            try {
                const result = await approveUser(id);
                showToast(result || 'User approved!', 'success');
                // Remove the card with animation
                const card = btn.closest('.user-card');
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';
                setTimeout(() => card.remove(), 300);
            } catch (err) {
                showToast(err.message || 'Failed to approve', 'error');
                btn.disabled = false;
            }
        });
    });

    container.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            btn.disabled = true;
            try {
                const result = await rejectUser(id);
                showToast(result || 'User rejected', 'info');
                const card = btn.closest('.user-card');
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';
                setTimeout(() => card.remove(), 300);
            } catch (err) {
                showToast(err.message || 'Failed to reject', 'error');
                btn.disabled = false;
            }
        });
    });
}

export async function mountAdmin() {
    const content = document.getElementById('admin-content');
    const tabs = document.querySelectorAll('.admin-tab');

    // Load pending by default
    await loadPending(content);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'pending') {
                loadPending(content);
            } else {
                loadAll(content);
            }
        });
    });
}

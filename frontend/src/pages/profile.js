// =============================================
// NexusBank — Profile Page
// =============================================
import { getProfile, getUserAccounts } from '../api.js';
import { showToast } from '../toast.js';

export function renderProfile() {
    return `
    <div class="page-header">
      <h1>My Profile</h1>
      <p>Your personal and account details</p>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
      <div class="card">
        <h2 style="font-size:1.05rem; font-weight:600; margin-bottom:20px;">Personal Information</h2>
        <div id="profile-info">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="card">
        <h2 style="font-size:1.05rem; font-weight:600; margin-bottom:20px;">Bank Account</h2>
        <div id="account-info">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `;
}

export async function mountProfile() {
    try {
        const profile = await getProfile();
        const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

        document.getElementById('profile-info').innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
        <div class="profile-avatar">${initials}</div>
        <div>
          <div style="font-size:1.1rem; font-weight:600;">${profile.name}</div>
          <div style="color:var(--text-muted); font-size:0.85rem;">${profile.email}</div>
        </div>
      </div>
      <div class="profile-grid">
        <div class="profile-item">
          <span class="label">Role</span>
          <span class="value"><span class="badge ${profile.role === 'ADMIN' ? 'badge-info' : 'badge-neutral'}">${profile.role}</span></span>
        </div>
        <div class="profile-item">
          <span class="label">Status</span>
          <span class="value"><span class="badge ${profile.status === 'APPROVED' ? 'badge-success' : profile.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}">${profile.status}</span></span>
        </div>
        <div class="profile-item">
          <span class="label">User ID</span>
          <span class="value">#${profile.id}</span>
        </div>
      </div>
    `;
    } catch (err) {
        document.getElementById('profile-info').innerHTML = `<p style="color:var(--accent-red)">Failed to load profile</p>`;
        showToast(err.message || 'Failed to load profile', 'error');
    }

    try {
        const account = await getUserAccounts();
        document.getElementById('account-info').innerHTML = `
      <div class="profile-grid">
        <div class="profile-item">
          <span class="label">Account Number</span>
          <span class="value" style="font-family:monospace; letter-spacing:0.05em;">${account.accountNumber}</span>
        </div>
        <div class="profile-item">
          <span class="label">Account ID</span>
          <span class="value">#${account.id}</span>
        </div>
        <div class="profile-item" style="grid-column: 1 / -1;">
          <span class="label">Current Balance</span>
          <span class="value" style="font-size:1.4rem; font-weight:700; color:var(--accent-green);">₹ ${Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    `;
    } catch {
        document.getElementById('account-info').innerHTML = `
      <div class="empty-state">
        <span class="material-icons-round">credit_card_off</span>
        <p>No account assigned yet.<br/>Please wait for admin approval.</p>
      </div>
    `;
    }
}

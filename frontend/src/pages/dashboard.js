// =============================================
// NexusBank — Dashboard Page
// =============================================
import { getProfile, getUserAccounts, getTransactionHistory, saveUser } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderDashboard() {
    return `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p id="dash-greeting">Welcome back!</p>
    </div>

    <div class="stats-grid" id="stats-grid">
      <div class="card stat-card indigo">
        <div class="stat-icon material-icons-round">account_balance_wallet</div>
        <div class="stat-label">Total Balance</div>
        <div class="stat-value" id="stat-balance"><div class="spinner" style="margin:0;width:24px;height:24px;"></div></div>
      </div>
      <div class="card stat-card green">
        <div class="stat-icon material-icons-round">credit_card</div>
        <div class="stat-label">Account Number</div>
        <div class="stat-value" id="stat-account" style="font-size:1.1rem;"><div class="spinner" style="margin:0;width:24px;height:24px;"></div></div>
      </div>
      <div class="card stat-card blue">
        <div class="stat-icon material-icons-round">swap_horiz</div>
        <div class="stat-label">Transactions</div>
        <div class="stat-value" id="stat-txn-count"><div class="spinner" style="margin:0;width:24px;height:24px;"></div></div>
      </div>
      <div class="card stat-card amber">
        <div class="stat-icon material-icons-round">verified_user</div>
        <div class="stat-label">Account Status</div>
        <div class="stat-value" id="stat-status"><div class="spinner" style="margin:0;width:24px;height:24px;"></div></div>
      </div>
    </div>

    <h2 style="font-size:1.1rem; font-weight:600; margin-bottom:14px;">Quick Actions</h2>
    <div class="quick-actions">
      <button class="quick-action-btn deposit" data-navigate="/deposit">
        <span class="material-icons-round">add_circle</span>
        Deposit
      </button>
      <button class="quick-action-btn withdraw" data-navigate="/withdraw">
        <span class="material-icons-round">remove_circle</span>
        Withdraw
      </button>
      <button class="quick-action-btn transfer" data-navigate="/transfer">
        <span class="material-icons-round">send</span>
        Transfer
      </button>
      <button class="quick-action-btn history" data-navigate="/history">
        <span class="material-icons-round">receipt_long</span>
        History
      </button>
    </div>

    <div class="card" style="margin-top:8px;">
      <h2 style="font-size:1.1rem; font-weight:600; margin-bottom:16px;">Recent Transactions</h2>
      <div id="recent-txns">
        <div class="spinner"></div>
      </div>
    </div>
  `;
}

function formatCurrency(amount) {
    return '₹ ' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
        d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export async function mountDashboard() {
    // Quick action navigation
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.navigate));
    });

    try {
        const [profile, account] = await Promise.all([
            getProfile(),
            getUserAccounts().catch(() => null),
        ]);

        saveUser(profile);

        document.getElementById('dash-greeting').textContent = `Welcome back, ${profile.name}!`;
        document.getElementById('stat-status').innerHTML =
            profile.status === 'APPROVED'
                ? '<span class="badge badge-success">Approved</span>'
                : profile.status === 'PENDING'
                    ? '<span class="badge badge-warning">Pending</span>'
                    : '<span class="badge badge-danger">Rejected</span>';

        if (account) {
            document.getElementById('stat-balance').textContent = formatCurrency(account.balance);
            document.getElementById('stat-account').textContent = account.accountNumber || '—';
        } else {
            document.getElementById('stat-balance').textContent = '—';
            document.getElementById('stat-account').textContent = 'Not assigned';
        }

        // Load recent transactions
        try {
            const txns = await getTransactionHistory();
            document.getElementById('stat-txn-count').textContent = txns.length;

            if (txns.length === 0) {
                document.getElementById('recent-txns').innerHTML = `
          <div class="empty-state">
            <span class="material-icons-round">receipt_long</span>
            <p>No transactions yet</p>
          </div>`;
            } else {
                const recent = txns.slice(0, 5);
                document.getElementById('recent-txns').innerHTML = `
          <div class="table-wrapper">
            <table>
              <thead><tr>
                <th>Type</th><th>Amount</th><th>Direction</th><th>Status</th><th>Date</th>
              </tr></thead>
              <tbody>
                ${recent.map(t => `
                  <tr>
                    <td><span class="badge badge-info">${t.type}</span></td>
                    <td style="font-weight:600; color:${t.direction === 'SENT' ? 'var(--accent-red)' : 'var(--accent-green)'}">
                      ${t.direction === 'SENT' ? '−' : '+'}${formatCurrency(t.amount)}
                    </td>
                    <td>${t.direction}</td>
                    <td><span class="badge ${t.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}">${t.status}</span></td>
                    <td style="color:var(--text-muted); font-size:0.82rem;">${formatDate(t.timestamp)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${txns.length > 5 ? '<p style="text-align:center; margin-top:12px;"><span class="link" data-navigate="/history">View all transactions →</span></p>' : ''}
        `;
                document.querySelector('#recent-txns [data-navigate="/history"]')?.addEventListener('click', () => navigateTo('/history'));
            }
        } catch {
            document.getElementById('stat-txn-count').textContent = '0';
            document.getElementById('recent-txns').innerHTML = `
        <div class="empty-state">
          <span class="material-icons-round">receipt_long</span>
          <p>No transactions yet</p>
        </div>`;
        }
    } catch (err) {
        showToast(err.message || 'Failed to load dashboard', 'error');
    }
}

// =============================================
// NexusBank — Transaction History Page
// =============================================
import { getTransactionHistory } from '../api.js';
import { showToast } from '../toast.js';

export function renderHistory() {
    return `
    <div class="page-header">
      <h1>Transaction History</h1>
      <p>View all your past transactions</p>
    </div>
    <div class="card">
      <div style="display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap;">
        <button class="btn btn-sm btn-secondary filter-btn active" data-filter="ALL">All</button>
        <button class="btn btn-sm btn-secondary filter-btn" data-filter="DEPOSIT">Deposits</button>
        <button class="btn btn-sm btn-secondary filter-btn" data-filter="WITHDRAW">Withdrawals</button>
        <button class="btn btn-sm btn-secondary filter-btn" data-filter="TRANSFER">Transfers</button>
      </div>
      <div id="history-content">
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

function renderTable(txns) {
    if (txns.length === 0) {
        return `<div class="empty-state">
      <span class="material-icons-round">receipt_long</span>
      <p>No transactions found</p>
    </div>`;
    }
    return `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>Type</th><th>Amount</th><th>Direction</th><th>Status</th><th>Date</th>
        </tr></thead>
        <tbody>
          ${txns.map(t => `
            <tr>
              <td><span class="badge ${t.type === 'DEPOSIT' ? 'badge-success' : t.type === 'WITHDRAW' ? 'badge-warning' : 'badge-info'}">${t.type}</span></td>
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
  `;
}

export async function mountHistory() {
    let allTxns = [];
    try {
        allTxns = await getTransactionHistory();
        document.getElementById('history-content').innerHTML = renderTable(allTxns);
    } catch (err) {
        showToast(err.message || 'Failed to load history', 'error');
        document.getElementById('history-content').innerHTML = `<div class="empty-state"><span class="material-icons-round">error</span><p>Failed to load</p></div>`;
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'ALL' ? allTxns : allTxns.filter(t => t.type === filter);
            document.getElementById('history-content').innerHTML = renderTable(filtered);
        });
    });
}

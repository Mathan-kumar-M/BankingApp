// =============================================
// NexusBank — Withdraw Page
// =============================================
import { withdraw, getUserAccounts } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderWithdraw() {
    return `
    <div class="page-header">
      <h1>Withdraw Funds</h1>
      <p>Withdraw money from your bank account</p>
    </div>
    <div class="card form-card">
      <form id="withdraw-form">
        <div class="form-group">
          <label for="wd-account">Your Account</label>
          <input type="text" id="wd-account" class="form-control" readonly placeholder="Loading..." />
          <input type="hidden" id="wd-account-id" />
        </div>
        <div class="form-group">
          <label for="wd-amount">Amount (₹)</label>
          <input type="number" id="wd-amount" class="form-control" placeholder="Enter amount" min="1" step="0.01" required />
        </div>
        <button type="submit" id="wd-btn" class="btn btn-primary btn-full">
          <span class="material-icons-round" style="font-size:18px;">remove_circle</span>
          Withdraw
        </button>
      </form>
    </div>
  `;
}

export async function mountWithdraw() {
    try {
        const account = await getUserAccounts();
        document.getElementById('wd-account').value = `${account.accountNumber}  (Balance: ₹${Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })})`;
        document.getElementById('wd-account-id').value = account.id;
    } catch (err) {
        showToast('Could not load account. Is your account approved?', 'error');
    }

    document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountId = document.getElementById('wd-account-id').value;
        const amount = parseFloat(document.getElementById('wd-amount').value);
        const btn = document.getElementById('wd-btn');

        if (!accountId) { showToast('No account found', 'error'); return; }
        if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }

        btn.disabled = true;
        try {
            const result = await withdraw(accountId, amount);
            showToast(result || 'Withdrawal successful!', 'success');
            setTimeout(() => navigateTo('/dashboard'), 1200);
        } catch (err) {
            showToast(err.message || 'Withdrawal failed', 'error');
            btn.disabled = false;
        }
    });
}

// =============================================
// NexusBank — Deposit Page
// =============================================
import { deposit, getUserAccounts } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderDeposit() {
    return `
    <div class="page-header">
      <h1>Deposit Funds</h1>
      <p>Add money to your bank account</p>
    </div>
    <div class="card form-card">
      <form id="deposit-form">
        <div class="form-group">
          <label for="dep-account">Your Account</label>
          <input type="text" id="dep-account" class="form-control" readonly placeholder="Loading..." />
          <input type="hidden" id="dep-account-id" />
        </div>
        <div class="form-group">
          <label for="dep-amount">Amount (₹)</label>
          <input type="number" id="dep-amount" class="form-control" placeholder="Enter amount" min="1" step="0.01" required />
        </div>
        <button type="submit" id="dep-btn" class="btn btn-success btn-full">
          <span class="material-icons-round" style="font-size:18px;">add_circle</span>
          Deposit
        </button>
      </form>
    </div>
  `;
}

export async function mountDeposit() {
    try {
        const account = await getUserAccounts();
        document.getElementById('dep-account').value = `${account.accountNumber}  (Balance: ₹${Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })})`;
        document.getElementById('dep-account-id').value = account.id;
    } catch (err) {
        showToast('Could not load account. Is your account approved?', 'error');
    }

    document.getElementById('deposit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountId = document.getElementById('dep-account-id').value;
        const amount = parseFloat(document.getElementById('dep-amount').value);
        const btn = document.getElementById('dep-btn');

        if (!accountId) { showToast('No account found', 'error'); return; }
        if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }

        btn.disabled = true;
        try {
            const result = await deposit(accountId, amount);
            showToast(result || 'Deposit successful!', 'success');
            setTimeout(() => navigateTo('/dashboard'), 1200);
        } catch (err) {
            showToast(err.message || 'Deposit failed', 'error');
            btn.disabled = false;
        }
    });
}

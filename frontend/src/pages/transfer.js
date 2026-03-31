// =============================================
// NexusBank — Transfer Page
// =============================================
import { transfer, getUserAccounts } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderTransfer() {
  return `
    <div class="page-header">
      <h1>Transfer Money</h1>
      <p>Send money to another account</p>
    </div>
    <div class="card form-card">
      <form id="transfer-form">
        <div class="form-group">
          <label for="tf-from">From Account</label>
          <input type="text" id="tf-from" class="form-control" readonly placeholder="Loading..." />
          <input type="hidden" id="tf-sender-id" />
        </div>
        <div class="form-group">
          <label for="tf-receiver">Receiver Account ID</label>
          <input type="text" id="tf-receiver" class="form-control" placeholder="Enter receiver's account ID" required />
        </div>
        <div class="form-group">
          <label for="tf-amount">Amount (₹)</label>
          <input type="number" id="tf-amount" class="form-control" placeholder="Enter amount" min="1" step="0.01" required />
        </div>
        <button type="submit" id="tf-btn" class="btn btn-primary btn-full">
          <span class="material-icons-round" style="font-size:18px;">send</span>
          Transfer
        </button>
      </form>
    </div>
  `;
}

export async function mountTransfer() {
  try {
    const account = await getUserAccounts();
    document.getElementById('tf-from').value = `${account.accountNumber}  (Balance: ₹${Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })})`;
    document.getElementById('tf-sender-id').value = account.id;
  } catch (err) {
    showToast('Could not load account. Is your account approved?', 'error');
  }

  document.getElementById('transfer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senderId = document.getElementById('tf-sender-id').value;
    const receiverId = document.getElementById('tf-receiver').value;
    const amount = parseFloat(document.getElementById('tf-amount').value);
    const btn = document.getElementById('tf-btn');

    if (!senderId) { showToast('No account found', 'error'); return; }
    if (!receiverId) { showToast('Enter receiver account ID', 'error'); return; }
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    if (senderId === receiverId) { showToast('Cannot transfer to the same account', 'error'); return; }

    btn.disabled = true;
    try {
      const result = await transfer(senderId, receiverId, amount);
      showToast(result || 'Transfer successful!', 'success');
      setTimeout(() => navigateTo('/dashboard'), 1200);
    } catch (err) {
      showToast(err.message || 'Transfer failed', 'error');
      btn.disabled = false;
    }
  });
}

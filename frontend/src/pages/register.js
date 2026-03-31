// =============================================
// NexusBank — Register Page
// =============================================
import { register } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderRegister() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="brand-header">
          <span class="brand-icon material-icons-round">account_balance</span>
          <h1>Create Account</h1>
          <p>Join Maara Bank and start banking today</p>
        </div>
        <form id="register-form">
          <div class="form-group">
            <label for="reg-name">Full Name</label>
            <input type="text" id="reg-name" class="form-control" placeholder="John Doe" required />
          </div>
          <div class="form-group">
            <label for="reg-email">Email Address</label>
            <input type="email" id="reg-email" class="form-control" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="reg-password">Password</label>
            <input type="password" id="reg-password" class="form-control" placeholder="Choose a strong password" minlength="6" required />
          </div>
          <button type="submit" id="register-btn" class="btn btn-primary btn-full" style="margin-top:8px;">
            <span class="material-icons-round" style="font-size:18px;">person_add</span>
            Create Account
          </button>
        </form>
        <p style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
          Already have an account?
          <span class="link" data-navigate="/">Sign in</span>
        </p>
      </div>
    </div>
  `;
}

export function mountRegister() {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('register-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;">hourglass_top</span> Creating...';

    try {
      const result = await register(name, email, password);
      const message = result.message || result;
      showToast(message, 'success', 5000);
      setTimeout(() => navigateTo('/'), 1500);
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;">person_add</span> Create Account';
    }
  });

  document.querySelector('[data-navigate="/"]')?.addEventListener('click', () => {
    navigateTo('/');
  });
}

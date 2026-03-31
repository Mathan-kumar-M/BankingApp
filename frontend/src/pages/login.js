// =============================================
// NexusBank — Login Page
// =============================================
import { login, setToken, getProfile, saveUser } from '../api.js';
import { showToast } from '../toast.js';
import { navigateTo } from '../main.js';

export function renderLogin() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="brand-header">
          <span class="brand-icon material-icons-round">account_balance</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your Maara Bank account</p>
        </div>
        <form id="login-form">
          <div class="form-group">
            <label for="login-email">Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required />
          </div>
          <button type="submit" id="login-btn" class="btn btn-primary btn-full" style="margin-top:8px;">
            <span class="material-icons-round" style="font-size:18px;">login</span>
            Sign In
          </button>
        </form>
        <p style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
          Don't have an account?
          <span class="link" data-navigate="/register">Create one</span>
        </p>
      </div>
    </div>
  `;
}

export function mountLogin() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;">hourglass_top</span> Signing in...';

    try {
      const token = await login(email, password);
      setToken(token);

      // Fetch profile to get role info
      try {
        const profile = await getProfile();
        saveUser(profile);
      } catch {
        // If user is not approved yet, profile may fail
        saveUser({ email, role: 'USER' });
      }

      showToast('Login successful!', 'success');
      navigateTo('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;">login</span> Sign In';
    }
  });

  // Handle register link
  document.querySelector('[data-navigate="/register"]')?.addEventListener('click', () => {
    navigateTo('/register');
  });
}

// =============================================
// NexusBank — App Router & Shell
// =============================================
import './style.css';
import { isLoggedIn, removeToken, getUser } from './api.js';
import { showToast } from './toast.js';

// Page imports
import { renderLogin, mountLogin } from './pages/login.js';
import { renderRegister, mountRegister } from './pages/register.js';
import { renderDashboard, mountDashboard } from './pages/dashboard.js';
import { renderDeposit, mountDeposit } from './pages/deposit.js';
import { renderWithdraw, mountWithdraw } from './pages/withdraw.js';
import { renderTransfer, mountTransfer } from './pages/transfer.js';
import { renderHistory, mountHistory } from './pages/history.js';
import { renderProfile, mountProfile } from './pages/profile.js';
import { renderAdmin, mountAdmin } from './pages/admin.js';

// ========== Route config ==========
const routes = {
    '/': { render: renderLogin, mount: mountLogin, auth: false, title: 'Sign In' },
    '/register': { render: renderRegister, mount: mountRegister, auth: false, title: 'Create Account' },
    '/dashboard': { render: renderDashboard, mount: mountDashboard, auth: true, title: 'Dashboard', icon: 'dashboard', nav: true },
    '/deposit': { render: renderDeposit, mount: mountDeposit, auth: true, title: 'Deposit', icon: 'add_circle', nav: true, section: 'Transactions' },
    '/withdraw': { render: renderWithdraw, mount: mountWithdraw, auth: true, title: 'Withdraw', icon: 'remove_circle', nav: true },
    '/transfer': { render: renderTransfer, mount: mountTransfer, auth: true, title: 'Transfer', icon: 'send', nav: true },
    '/history': { render: renderHistory, mount: mountHistory, auth: true, title: 'History', icon: 'receipt_long', nav: true },
    '/profile': { render: renderProfile, mount: mountProfile, auth: true, title: 'Profile', icon: 'person', nav: true, section: 'Account' },
    '/admin': { render: renderAdmin, mount: mountAdmin, auth: true, title: 'Admin Panel', icon: 'admin_panel_settings', nav: true, adminOnly: true, section: 'Management' },
};

let currentPath = '/';

// ========== Navigation ==========
export function navigateTo(path) {
    if (path === currentPath && path !== '/') return;
    window.history.pushState({}, '', path);
    renderRoute(path);
}

function renderRoute(path) {
    const route = routes[path] || routes['/'];
    currentPath = path;

    // Auth guard
    if (route.auth && !isLoggedIn()) {
        navigateTo('/');
        return;
    }
    if (!route.auth && isLoggedIn() && (path === '/' || path === '/register')) {
        navigateTo('/dashboard');
        return;
    }

    // Admin guard
    const user = getUser();
    if (route.adminOnly && (!user || user.role !== 'ADMIN')) {
        showToast('Access denied: Admin only', 'error');
        navigateTo('/dashboard');
        return;
    }

    // Update document title
    document.title = `${route.title} — Maara Bank`;

    // Show/hide sidebar
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    if (route.auth) {
        sidebar.classList.remove('hidden');
        mainContent.classList.add('with-sidebar');
        buildNav(path);
    } else {
        sidebar.classList.add('hidden');
        mainContent.classList.remove('with-sidebar');
    }

    // Render page content
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = route.render();

    // Mount page logic
    if (route.mount) {
        route.mount();
    }
}

// ========== Build sidebar nav ==========
function buildNav(activePath) {
    const nav = document.getElementById('nav-links');
    const user = getUser();
    let html = '';
    let currentSection = '';

    for (const [path, config] of Object.entries(routes)) {
        if (!config.nav) continue;
        if (config.adminOnly && (!user || user.role !== 'ADMIN')) continue;

        // Section header
        if (config.section && config.section !== currentSection) {
            currentSection = config.section;
            html += `<li class="nav-section-title">${currentSection}</li>`;
        }

        html += `
      <li>
        <button class="nav-item ${activePath === path ? 'active' : ''}" data-navigate="${path}">
          <span class="material-icons-round">${config.icon}</span>
          <span>${config.title}</span>
        </button>
      </li>
    `;
    }

    nav.innerHTML = html;

    // Bind navigation clicks
    nav.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.navigate));
    });
}

// ========== Logout ==========
function setupLogout() {
    document.getElementById('btn-logout').addEventListener('click', () => {
        removeToken();
        showToast('Signed out successfully', 'info');
        navigateTo('/');
    });
}

// ========== Initialize ==========
function init() {
    setupLogout();

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        renderRoute(window.location.pathname);
    });

    // Initial render
    renderRoute(window.location.pathname);
}

init();

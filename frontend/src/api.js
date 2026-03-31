// =============================================
// NexusBank — API Client with JWT Interceptor
// =============================================

// Use environment variable if deployed, otherwise fallback to local backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('nexus_token');
}

export function setToken(token) {
  localStorage.setItem('nexus_token', token);
}

export function removeToken() {
  localStorage.removeItem('nexus_token');
  localStorage.removeItem('nexus_user');
}

export function isLoggedIn() {
  return !!getToken();
}

export function saveUser(user) {
  localStorage.setItem('nexus_user', JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('nexus_user'));
  } catch { return null; }
}

/**
 * Core fetch wrapper — auto-attaches JWT token
 */
async function apiFetch(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is an object and not FormData, JSON serialize
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-OK responses
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const errData = await res.json();
      errorMsg = errData.Message || errData.message || errData.error || errorMsg;
    } catch {
      try { errorMsg = await res.text(); } catch { }
    }
    throw new Error(errorMsg);
  }

  // Try to parse JSON, fallback to text
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// ========== Auth ==========
export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function register(name, email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

// ========== User ==========
export function getProfile() {
  return apiFetch('/api/user/profile');
}

export function getUserAccounts() {
  return apiFetch('/api/user/accounts');
}

// ========== Transactions ==========
export function deposit(accountId, amount) {
  return apiFetch(`/transactions/deposit?accountId=${accountId}&amount=${amount}`, {
    method: 'POST',
  });
}

export function withdraw(accountId, amount) {
  return apiFetch(`/transactions/withdraw?accountId=${accountId}&amount=${amount}`, {
    method: 'POST',
  });
}

export function transfer(senderId, receiverAccountNumber, amount) {
  return apiFetch(`/transactions/transfer?senderId=${senderId}&receiverAccountNumber=${receiverAccountNumber}&amount=${amount}`, {
    method: 'POST',
  });
}

export function getTransactionHistory() {
  return apiFetch('/transactions/view');
}

// ========== Admin ==========
export function getPendingUsers() {
  return apiFetch('/api/admin/pending');
}

export function approveUser(userId) {
  return apiFetch(`/api/admin/approve/${userId}`, { method: 'POST' });
}

export function rejectUser(userId) {
  return apiFetch(`/api/admin/reject/${userId}`, { method: 'POST' });
}

export function getAllUsers() {
  return apiFetch('/api/admin/users');
}

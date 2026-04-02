const API = {
    getToken() {
        return localStorage.getItem('token');
    },
    
    setToken(token) {
        localStorage.setItem('token', token);
    },
    
    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    },

    async request(endpoint, method = 'GET', body = null, requireAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (requireAuth) {
            const token = this.getToken();
            if (!token) {
                window.location.href = '/';
                return;
            }
            headers['Authorization'] = `Bearer ${token}`; // Adjust based on Spring config, assuming Bearer
        }

        // Transactions API uses url-encoded request params 
        let url = endpoint;
        let options = {
            method,
            headers,
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            // For url params like /transactions/deposit?accountId=...
            if (endpoint.startsWith('/transactions/')) {
                const params = new URLSearchParams();
                for (const key in body) {
                    params.append(key, body[key]);
                }
                url += '?' + params.toString();
            } else {
                options.body = JSON.stringify(body);
            }
        }

        const response = await fetch(url, options);

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    },

    get(endpoint, requireAuth = true) {
        return this.request(endpoint, 'GET', null, requireAuth);
    },

    post(endpoint, body, requireAuth = true) {
        return this.request(endpoint, 'POST', body, requireAuth);
    }
};

// Global UI utilities
function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    if (isError) {
        toast.style.backgroundColor = '#ef4444';
    } else {
        toast.style.backgroundColor = '#10b981';
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

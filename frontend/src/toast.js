// =============================================
// NexusBank — Toast Notifications
// =============================================

const ICONS = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
};

export function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <span class="material-icons-round">${ICONS[type] || 'info'}</span>
    <span>${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

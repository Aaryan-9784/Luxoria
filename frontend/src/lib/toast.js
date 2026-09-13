/**
 * Lightweight toast notification system (zero dependencies).
 * Drop-in replacement for react-hot-toast / sonner's `toast` API.
 */

let container = null;
const activeToasts = new Set();

function getContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.id = 'toast-container';
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '99999',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
  });
  document.body.appendChild(container);
  return container;
}

function createToast(message, { type = 'default', duration = 4000 } = {}) {
  if (activeToasts.has(message)) {
    return null;
  }
  activeToasts.add(message);

  const el = document.createElement('div');

  const colors = {
    default: { bg: '#111111', border: '#333' },
    success: { bg: '#111111', border: '#16A34A' },
    error: { bg: '#111111', border: '#DC2626' },
  };

  const c = colors[type] || colors.default;

  const icons = {
    success: '✓',
    error: '✕',
    default: 'ℹ',
  };

  Object.assign(el.style, {
    background: c.bg,
    color: '#ffffff',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
    borderLeft: `4px solid ${c.border}`,
    pointerEvents: 'auto',
    opacity: '0',
    transform: 'translateX(30px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    maxWidth: '380px',
    wordBreak: 'break-word',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  });

  el.innerHTML = `<span style="font-size:16px;flex-shrink:0">${icons[type]}</span><span>${message}</span>`;

  el.addEventListener('click', () => dismiss(el, message));

  getContainer().appendChild(el);

  // Trigger enter animation
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(0)';
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => dismiss(el, message), duration);
  }

  return el;
}

function dismiss(el, message) {
  el.style.opacity = '0';
  el.style.transform = 'translateX(30px)';
  setTimeout(() => {
    activeToasts.delete(message);
    el.remove();
  }, 300);
}

const toast = (message, options) => createToast(message, options);
toast.success = (message, options) => createToast(message, { ...options, type: 'success' });
toast.error = (message, options) => createToast(message, { ...options, type: 'error' });

export { toast };
export default toast;

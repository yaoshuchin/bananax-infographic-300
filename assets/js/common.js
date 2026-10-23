(() => {
  const SHARE_NUDGE_KEY = 'bx_share_nudge_log';
  const SHARE_NUDGE_MAX_PER_DAY = 3;
  let shareNudgePending = false;

  function canShowShareNudge() {
    if (shareNudgePending) return false;
    try {
      const today = new Date().toISOString().split('T')[0];
      const item = localStorage.getItem(SHARE_NUDGE_KEY);
      const log = item ? JSON.parse(item) : {};
      if (log.date !== today) {
        return true;
      }
      return (log.count || 0) < SHARE_NUDGE_MAX_PER_DAY;
    } catch (e) {
      return true;
    }
  }

  function recordShareNudge() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const item = localStorage.getItem(SHARE_NUDGE_KEY);
      let log = item ? JSON.parse(item) : {};
      if (log.date !== today) {
        log = { date: today, count: 0 };
      }
      log.count = (log.count || 0) + 1;
      localStorage.setItem(SHARE_NUDGE_KEY, JSON.stringify(log));
    } catch (e) {
      console.warn('localStorage access failed:', e);
    }
  }

  function showToast(message, duration = 3000, className = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${className}`.trim();

    const iconName = className.includes('special') ? 'sparkles' : 'check-circle';
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconName);
    icon.style.width = '18px';
    icon.style.height = '18px';

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function scheduleShareNudge(message, itemId, itemName, delay = 3500) {
    if (!canShowShareNudge()) return false;
    shareNudgePending = true;
    setTimeout(() => {
      try {
        recordShareNudge();
      } catch (e) {
        console.error('Share nudge recording failed:', e);
      }
      try {
        showToast(message, 5000, 'special-share');
      } catch (e) {
        console.error('Share nudge display failed:', e);
      } finally {
        shareNudgePending = false;
      }
    }, delay);
    return true;
  }

  window.showToast = showToast;
  window.scheduleShareNudge = scheduleShareNudge;
})();

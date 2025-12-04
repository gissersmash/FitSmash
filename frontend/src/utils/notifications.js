export const showNotification = (type, message, details = '') => {
  const colors = {
    success: { bg: 'linear-gradient(135deg, #1ec287 0%, #16a970 100%)', shadow: 'rgba(30, 194, 135, 0.4)' },
    error: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.4)' },
    info: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.4)' },
    warning: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.4)' }
  };

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill'
  };

  const color = colors[type] || colors.info;
  const icon = icons[type] || icons.info;

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color.bg};
    color: white;
    padding: ${details ? '20px 28px' : '16px 24px'};
    border-radius: ${details ? '16px' : '12px'};
    box-shadow: 0 ${details ? '12px 32px' : '8px 24px'} ${color.shadow};
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;

  if (details) {
    notification.innerHTML = `
      <div style="display: flex; align-items: start; gap: 16px;">
        <i class="bi ${icon}" style="font-size: 28px; margin-top: 2px;"></i>
        <div>
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">
            ${message}
          </div>
          <div style="font-size: 13px; opacity: 0.95; line-height: 1.5;">
            ${details}
          </div>
        </div>
      </div>
    `;
  } else {
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; font-weight: 600;">
        <i class="bi ${icon}" style="font-size: 20px;"></i>
        <span>${message}</span>
      </div>
    `;
  }

  document.body.appendChild(notification);
  
  const duration = type === 'error' ? 4000 : 3000;
  const timeoutId = setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    const removeTimeoutId = setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
    
    // Store timeout IDs for potential cleanup
    notification.dataset.timeoutId = removeTimeoutId;
  }, duration);
  
  // Store main timeout ID
  notification.dataset.mainTimeoutId = timeoutId;
  
  return notification; // Return for manual cleanup if needed
};

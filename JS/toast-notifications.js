/**
 * Hệ thống thông báo Toast đẹp mắt
 * Sử dụng: showToast('Thông báo thành công!', 'success')
 */

// Tạo container cho toast nếu chưa có
function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Hiển thị thông báo toast
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Thời gian hiển thị (ms), mặc định 4000ms
 * @param {string} title - Tiêu đề thông báo (tùy chọn)
 */
function showToast(message, type = 'info', duration = 4000, title = null) {
    const container = getToastContainer();
    
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon và màu sắc theo loại
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-xmark"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
    };
    
    const titles = {
        success: 'Thành công',
        error: 'Lỗi',
        warning: 'Cảnh báo',
        info: 'Thông tin'
    };
    
    const displayTitle = title || titles[type] || 'Thông báo';
    
    // Cấu trúc HTML của toast
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            ${title !== null ? `<div class="toast-title">${displayTitle}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Đóng">
            <i class="fa-solid fa-times"></i>
        </button>
        <div class="toast-progress"></div>
    `;
    
    // Thêm vào container
    container.appendChild(toast);
    
    // Xử lý nút đóng
    const closeBtn = toast.querySelector('.toast-close');
    const closeToast = () => {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeToast);
    
    // Tự động đóng sau duration
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar && duration > 0) {
        progressBar.style.animationDuration = `${duration}ms`;
        setTimeout(closeToast, duration);
    }
    
    // Click vào toast để đóng (trừ nút đóng)
    toast.addEventListener('click', (e) => {
        if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
            closeToast();
        }
    });
    
    return toast;
}

// Các hàm tiện ích
function showSuccess(message, title = null, duration = 4000) {
    return showToast(message, 'success', duration, title);
}

function showError(message, title = null, duration = 5000) {
    return showToast(message, 'error', duration, title);
}

function showWarning(message, title = null, duration = 4000) {
    return showToast(message, 'warning', duration, title);
}

function showInfo(message, title = null, duration = 4000) {
    return showToast(message, 'info', duration, title);
}

// Export để sử dụng global
window.showToast = showToast;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;








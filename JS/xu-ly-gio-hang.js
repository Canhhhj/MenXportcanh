let productLookup = new Map();

function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem('giohang')) || [];
    } catch (error) {
        console.error('Không thể đọc giỏ hàng', error);
        return [];
    }
}

function saveCartItems(items) {
    localStorage.setItem('giohang', JSON.stringify(items));
}

function calculateLinePrice(item) {
    // Ưu tiên giá đã lưu trong item (đã được tính khi thêm vào giỏ)
    const basePrice = item.gia || 0;
    return Number(basePrice) * (item.soLuong || 1);
}

function renderCartTable() {
    const tbody = document.querySelector('#cart-table tbody');
    const emptyState = document.getElementById('cart-empty');
    const items = getCartItems();

    if (!tbody) return;

    if (!items.length) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.style.pointerEvents = 'none';
            checkoutBtn.style.opacity = '0.5';
        }
        renderSummary();
        return;
    }

    emptyState.style.display = 'none';
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.style.pointerEvents = 'auto';
        checkoutBtn.style.opacity = '1';
    }

    tbody.innerHTML = items.map((item, index) => {
        const product = productLookup.get(item.id) || item;
        // Sử dụng giá đã lưu trong item (đã được tính đúng khi thêm vào giỏ)
        const unitPrice = item.gia || 0;
        const productName = product.ten || item.ten || 'Sản phẩm';
        const productBrand = product.brand || item.brand || 'MENXPORT';
        const productImage = item.hinh || product.hinh_anh_chinh || '../taiNguyen/img/logo/logomenxport.png';

        return `
            <tr>
                <td data-label="">
                    <div class="cart-product">
                        <img src="${productImage}" alt="${productName}" onerror="this.src='../taiNguyen/img/logo/logomenxport.png'">
                        <div>
                            <strong>${productName}</strong>
                            <p>${productBrand}</p>
                        </div>
                    </div>
                </td>
                <td data-label="Đơn giá">${formatCurrency(unitPrice)}</td>
                <td data-label="Số lượng">
                    <div class="qty-control">
                        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                        <span>${item.soLuong || 1}</span>
                        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                    </div>
                </td>
                <td data-label="Thành tiền">${formatCurrency(calculateLinePrice(item))}</td>
                <td data-label="">
                    <button class="remove-btn" data-action="remove" data-index="${index}" title="Xóa sản phẩm">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    renderSummary();
}

function renderSummary() {
    const items = getCartItems();
    const summaryList = document.getElementById('cart-summary-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');

    const subtotal = items.reduce((sum, item) => sum + calculateLinePrice(item), 0);
    const shipping = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
    const total = subtotal + shipping;

    if (summaryList) {
        summaryList.innerHTML = items.map(item => {
            const product = productLookup.get(item.id) || item;
            const productName = product.ten || item.ten || 'Sản phẩm';
            const quantity = item.soLuong || 1;
            return `<li><span>${productName} × ${quantity}</span><span>${formatCurrency(calculateLinePrice(item))}</span></li>`;
        }).join('');
    }

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Freeship' : formatCurrency(shipping);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

function updateQuantity(index, delta) {
    const items = getCartItems();
    const target = items[index];
    if (!target) {
        console.error("Không tìm thấy sản phẩm tại index:", index);
        return;
    }
    const oldQuantity = target.soLuong || 1;
    const newQuantity = Math.max(1, oldQuantity + delta);
    
    if (newQuantity === oldQuantity && delta < 0) {
        // Đã đạt số lượng tối thiểu
        if (typeof showWarning === 'function') {
            showWarning('Số lượng tối thiểu là 1', 'Giỏ hàng');
        }
        return;
    }
    
    target.soLuong = newQuantity;
    saveCartItems(items);
    renderCartTable();
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    // Hiển thị thông báo cập nhật số lượng
    const product = productLookup.get(target.id) || target;
    const productName = product.ten || target.ten || 'Sản phẩm';
    if (typeof showSuccess === 'function') {
        if (delta > 0) {
            showSuccess(`Đã tăng số lượng "${productName}" lên ${newQuantity}`, 'Cập nhật giỏ hàng', 2000);
        } else {
            showSuccess(`Đã giảm số lượng "${productName}" xuống ${newQuantity}`, 'Cập nhật giỏ hàng', 2000);
        }
    }
}

function removeItem(index) {
    const items = getCartItems();
    if (index < 0 || index >= items.length) {
        console.error("Index không hợp lệ:", index);
        return;
    }
    
    const itemToRemove = items[index];
    const product = productLookup.get(itemToRemove.id) || itemToRemove;
    const productName = product.ten || itemToRemove.ten || 'Sản phẩm';
    
    // Hiển thị toast xác nhận (không dùng confirm nữa)
    // Nếu có hàm showConfirm thì dùng, nếu không thì xóa luôn
    if (typeof showConfirm === 'function') {
        // Có thể tạo hàm showConfirm sau nếu cần
        items.splice(index, 1);
        saveCartItems(items);
        renderCartTable();
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        if (typeof showSuccess === 'function') {
            showSuccess(`Đã xóa "${productName}" khỏi giỏ hàng`, 'Xóa sản phẩm');
        }
    } else {
        // Xóa luôn và hiển thị thông báo
        items.splice(index, 1);
        saveCartItems(items);
        renderCartTable();
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        if (typeof showSuccess === 'function') {
            showSuccess(`Đã xóa "${productName}" khỏi giỏ hàng`, 'Xóa sản phẩm');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    const products = await loadAllProducts();
    productLookup = new Map(products.map(p => [p.id, p]));

    const table = document.getElementById('cart-table');
    if (table) {
        table.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (!target) return;
            const index = Number(target.dataset.index);
            const action = target.dataset.action;
            if (action === 'increase') updateQuantity(index, 1);
            if (action === 'decrease') updateQuantity(index, -1);
            if (action === 'remove') removeItem(index);
        });
    }

    renderCartTable();
});

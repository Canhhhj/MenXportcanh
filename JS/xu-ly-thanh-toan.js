let checkoutProductLookup = new Map();

function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem('giohang')) || [];
    } catch (error) {
        console.error('Không thể đọc giỏ hàng', error);
        return [];
    }
}

function calculateLinePrice(item) {
    // Sử dụng giá đã lưu trong item (đã được tính đúng khi thêm vào giỏ)
    const price = item.gia || 0;
    return Number(price) * (item.soLuong || 1);
}

function renderSummary() {
    const items = getCartItems();
    const summaryList = document.getElementById('summary-list');
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    const submitBtn = document.getElementById('submit-order');

    if (!items.length) {
        summaryList.innerHTML = '<li>Chưa có sản phẩm trong giỏ.</li>';
        subtotalEl.textContent = '0₫';
        shippingEl.textContent = '0₫';
        totalEl.textContent = '0₫';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Giỏ hàng trống';
        return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Đặt hàng ngay';

    summaryList.innerHTML = items.map(item => {
        const product = checkoutProductLookup.get(item.id) || item;
        const productName = product.ten || item.ten || 'Sản phẩm';
        const quantity = item.soLuong || 1;
        return `<li><span>${productName} × ${quantity}</span><span>${formatCurrency(calculateLinePrice(item))}</span></li>`;
    }).join('');

    const subtotal = items.reduce((sum, item) => sum + calculateLinePrice(item), 0);
    const shipping = subtotal >= 2000000 ? 0 : 50000;
    const total = subtotal + shipping;

    subtotalEl.textContent = formatCurrency(subtotal);
    shippingEl.textContent = shipping === 0 ? 'Freeship' : formatCurrency(shipping);
    totalEl.textContent = formatCurrency(total);
    return { subtotal, shipping, total, items };
}

function createOrderCode() {
    return 'MX' + Math.floor(100000 + Math.random() * 900000);
}

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    const products = await loadAllProducts();
    checkoutProductLookup = new Map(products.map(p => [p.id, p]));
    renderSummary();

    const form = document.getElementById('checkout-form');
    const successBlock = document.getElementById('order-success');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const cartSnapshot = renderSummary();
        if (!cartSnapshot || !cartSnapshot.items.length) return;

        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const customerEmail = document.getElementById('customer-email').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const note = document.getElementById('customer-note').value.trim();
        const paymentRadio = form.querySelector('input[name="payment"]:checked');
        
        if (!customerName || !customerPhone || !customerAddress) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ)!');
            return;
        }
        
        if (!/^0[0-9]{9,10}$/.test(customerPhone)) {
            alert('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại 10-11 chữ số bắt đầu bằng 0.');
            return;
        }
        
        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            alert('Email không hợp lệ! Vui lòng kiểm tra lại.');
            return;
        }
        
        if (!paymentRadio) {
            alert('Vui lòng chọn phương thức thanh toán!');
            return;
        }
        
        const payment = paymentRadio.value;

        const orderPayload = {
            code: createOrderCode(),
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress,
            note,
            payment,
            subtotal: cartSnapshot.subtotal,
            shipping: cartSnapshot.shipping,
            total: cartSnapshot.total,
            items: cartSnapshot.items
        };

        const submitBtn = document.getElementById('submit-order');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';

        try {
            const response = await fetch(`${window.MX_API_BASE}/don-hang`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(orderPayload)
            });
            if (!response.ok) throw new Error('Không thể tạo đơn hàng');
            await response.json();

            localStorage.removeItem('giohang');
            updateCartCount();
            renderSummary();

            document.getElementById('order-code').textContent = `#${orderPayload.code}`;
            document.getElementById('order-customer').textContent = `${orderPayload.name} (${orderPayload.phone})`;
            successBlock.style.display = 'block';
            form.reset();
        } catch (error) {
            console.error(error);
            alert('Có lỗi khi đặt hàng. Vui lòng thử lại!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đặt hàng ngay';
        }
    });
});

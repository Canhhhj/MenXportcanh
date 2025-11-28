let checkoutProductLookup = new Map();
const GOOGLE_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzjdNrN6zcwgf_Ol_YF0Cj17DwZ5V8DW64zaPtvNe3TF6M0cWSWgAU5sT7BNSuNDdRv/exec';

function getCartItems() {
    try {
        // Kiểm tra nếu có sản phẩm "Mua ngay" - chỉ hiển thị sản phẩm đó
        const buyNowProduct = localStorage.getItem('buyNowProduct');
        if (buyNowProduct) {
            const product = JSON.parse(buyNowProduct);
            return [product]; // Chỉ trả về sản phẩm "Mua ngay"
        }
        // Nếu không có "Mua ngay", trả về tất cả sản phẩm trong giỏ hàng
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
            showError('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ)!', 'Thiếu thông tin');
            return;
        }
        
        if (!/^0[0-9]{9,10}$/.test(customerPhone)) {
            showError('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại 10-11 chữ số bắt đầu bằng 0.', 'Số điện thoại không hợp lệ');
            return;
        }
        
        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            showError('Email không hợp lệ! Vui lòng kiểm tra lại.', 'Email không hợp lệ');
            return;
        }
        
        if (!paymentRadio) {
            showError('Vui lòng chọn phương thức thanh toán!', 'Thiếu thông tin');
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
            let apiSaved = false;
            let sheetSaved = false;

            try {
                const response = await fetch(`${window.MX_API_BASE}/don-hang`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(orderPayload)
                });
                if (response.ok) {
                    await response.json();
                    apiSaved = true;
                } else {
                    console.warn('Không thể tạo đơn hàng qua API:', await response.text());
                }
            } catch (apiError) {
                console.warn('API đặt hàng đang không khả dụng:', apiError);
            }

            // Chuẩn bị dữ liệu sản phẩm cho Google Sheet
            const productsForSheet = orderPayload.items
                .map(item => {
                    const productName = item.ten || checkoutProductLookup.get(item.id)?.ten || item.id;
                    const quantity = item.soLuong || 1;
                    const price = formatCurrency(calculateLinePrice(item));
                    return `${productName} (SL: ${quantity}, Giá: ${price})`;
                })
                .join(' | ');

            // Dữ liệu gửi lên Google Sheet (phải khớp với Apps Script)
            const sheetPayload = {
                orderCode: orderPayload.code,      // Mã đơn
                name: orderPayload.name,            // Tên
                phone: orderPayload.phone,          // SĐT
                email: orderPayload.email || '',    // Email
                address: orderPayload.address,      // Địa chỉ
                products: productsForSheet,         // Sản phẩm
                payment: payment === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng', // Hình thức thanh toán
                orderDate: new Date().toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) // Ngày đặt
            };

            // Gửi dữ liệu lên Google Sheet
            try {
                const sheetResponse = await fetch(GOOGLE_SHEET_WEBHOOK, {
                    method: 'POST',
                    mode: 'no-cors', // Bỏ qua CORS để gửi được đến Google Apps Script
                    headers: {
                        'Content-Type': 'text/plain;charset=UTF-8'
                    },
                    body: JSON.stringify(sheetPayload)
                });
                // Với mode: 'no-cors', không thể đọc response, nhưng request đã được gửi
                sheetSaved = true;
                console.log('Đã gửi dữ liệu lên Google Sheet:', sheetPayload);
            } catch (sheetError) {
                console.error('Không thể ghi dữ liệu vào Google Sheet:', sheetError);
                sheetSaved = false;
            }

            // Xử lý kết quả
            if (!apiSaved && !sheetSaved) {
                showError('Có lỗi khi đặt hàng. Vui lòng thử lại!', 'Đặt hàng thất bại');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Đặt hàng ngay';
                return;
            }

            // Hiển thị thông báo thành công
            if (sheetSaved) {
                // Xóa cả giỏ hàng và sản phẩm "Mua ngay" sau khi đặt hàng thành công
                localStorage.removeItem('giohang');
                localStorage.removeItem('buyNowProduct');
                updateCartCount();
                renderSummary();

                document.getElementById('order-code').textContent = `#${orderPayload.code}`;
                document.getElementById('order-customer').textContent = `${orderPayload.name} (${orderPayload.phone})`;
                successBlock.style.display = 'block';
                form.reset();
                
                // Hiển thị toast thông báo thành công
                if (typeof showSuccess === 'function') {
                    showSuccess(
                        `Đơn hàng #${orderPayload.code} đã được đặt thành công! Menxport sẽ liên hệ với bạn trong vòng 15 phút.`,
                        'Đặt hàng thành công',
                        6000
                    );
                }
                
                // Scroll đến phần thông báo thành công
                successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        } catch (error) {
            console.error(error);
            showError('Có lỗi khi đặt hàng. Vui lòng thử lại!', 'Đặt hàng thất bại');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đặt hàng ngay';
        }
    });
});

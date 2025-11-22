// File này có thể không được sử dụng nữa vì đã có xu-ly-chung.js
// Giữ lại để tương thích ngược nếu có trang nào còn dùng
const productContainer = document.querySelector('.product-list');

if (productContainer) {
    // Sử dụng hàm formatCurrency từ xu-ly-chung.js nếu có
    const formatPrice = typeof formatCurrency === 'function' ? formatCurrency : (num) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    fetch('http://localhost:3000/san-pham')
        .then(res => res.json())
        .then(data => {
            data.forEach(sp => {
                const div = document.createElement('div');
                div.classList.add('product');
                const detailLink = sp.detail_page || `chitetsanpham.html?id=${sp.id}`;
                div.innerHTML = `
                    <img src="${sp.hinh_anh_chinh || sp.hinh || ''}" alt="${sp.ten}" onerror="this.src='../taiNguyen/img/logo/logomenxport.png'">
                    <h3>${sp.ten}</h3>
                    <p>${formatPrice(sp.gia_khuyen_mai && sp.gia_khuyen_mai < sp.gia ? sp.gia_khuyen_mai : sp.gia)}</p>
                    <a href="${detailLink}">Xem chi tiết</a>
                `;
                productContainer.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải sản phẩm:', error);
            productContainer.innerHTML = '<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>';
        });
}

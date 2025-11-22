const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

let currentProduct = null;
let quantity = 1;

function setQuantity(value) {
    quantity = Math.max(1, value);
    document.getElementById('quantity-value').textContent = quantity;
}

function renderThumbnails(images = []) {
    const strip = document.getElementById('thumbnail-strip');
    if (!strip) return;
    const allImages = [currentProduct?.hinh_anh_chinh, ...(images || [])].filter(Boolean);
    strip.innerHTML = allImages.map((src, idx) => `
        <button class="thumb ${idx === 0 ? 'active' : ''}" data-src="${src}">
            <img src="${src}" alt="Hình phụ">
        </button>
    `).join('');

    strip.querySelectorAll('.thumb').forEach(btn => {
        btn.addEventListener('click', () => {
            strip.querySelectorAll('.thumb').forEach(i => i.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('main-image').src = btn.dataset.src;
        });
    });
}

function renderFeatures(list = []) {
    const container = document.getElementById('product-feature-list');
    container.innerHTML = list.map(item => `<li><i class="fa-solid fa-check"></i> ${item}</li>`).join('');
}

function renderSpecs(product) {
    const specsTable = document.getElementById('specs-table');
    if (!specsTable) return;
    const specRows = [
        ['Thương hiệu', product.brand || 'MENXPORT'],
        ['Danh mục', product.category || 'Thể thao'],
        ['Mã sản phẩm', product.id.toUpperCase()],
        ['Tình trạng', 'Còn hàng'],
    ];
    specsTable.innerHTML = specRows.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('');
}

function renderRelatedProducts(products) {
    if (!Array.isArray(products) || !products.length) return;
    const sameCategory = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
    const suggestions = sameCategory.length ? sameCategory : products.slice(0, 4);
    // Sử dụng hàm renderProductSection từ xu-ly-chung.js nếu có
    if (typeof renderProductSection === 'function') {
        renderProductSection('related-grid', suggestions);
    } else {
        // Fallback: tự render
        const container = document.getElementById('related-grid');
        if (container) {
            container.innerHTML = suggestions.map(p => {
                if (typeof createProductCard === 'function') {
                    return createProductCard(p);
                }
                return `<div>${p.ten}</div>`;
            }).join('');
            if (typeof setupBuyNowListeners === 'function') {
                setupBuyNowListeners();
            }
        }
    }
}

async function fetchProductById(id) {
    try {
        const res = await fetch(`${window.MX_API_BASE}/san-pham/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy trên API');
        const data = await res.json();
        return typeof normalizeProduct === 'function' ? normalizeProduct(data) : data;
    } catch (err) {
        console.warn('Không lấy được từ API, dùng cache:', err);
        const products = await loadAllProducts();
        return products.find(p => p.id === id);
    }
}

async function loadProductDetail() {
    if (!productId) {
        document.getElementById('product-title').textContent = 'Không tìm thấy sản phẩm';
        return;
    }

    updateCartCount();
    currentProduct = await fetchProductById(productId);

    if (!currentProduct) {
        document.getElementById('product-title').textContent = 'Sản phẩm đã ngừng kinh doanh';
        return;
    }

    // Nếu sản phẩm có trang chi tiết tĩnh, redirect đến đó
    if (currentProduct.detail_page) {
        window.location.href = currentProduct.detail_page;
        return;
    }

    document.getElementById('product-title').textContent = currentProduct.ten;
    document.getElementById('product-title-hero').textContent = currentProduct.ten;
    document.getElementById('product-breadcrumb').textContent = currentProduct.ten;
    document.getElementById('product-brand').textContent = currentProduct.brand || 'MENXPORT';
    document.getElementById('product-desc').textContent = currentProduct.mo_ta_ngan || '';
    document.getElementById('long-description').textContent = currentProduct.mo_ta_ngan || 'Đang cập nhật mô tả chi tiết.';

    const currentPrice = currentProduct.gia_khuyen_mai && currentProduct.gia_khuyen_mai > 0 && currentProduct.gia_khuyen_mai < currentProduct.gia ? currentProduct.gia_khuyen_mai : currentProduct.gia;
    document.getElementById('product-price-current').textContent = formatCurrency(currentPrice);

    if (currentProduct.gia_khuyen_mai && currentProduct.gia_khuyen_mai < currentProduct.gia) {
        document.getElementById('product-price-old').textContent = formatCurrency(currentProduct.gia);
    } else {
        document.getElementById('product-price-old').textContent = '';
    }

    document.getElementById('main-image').src = currentProduct.hinh_anh_chinh;
    renderThumbnails(currentProduct.hinh_anh_phu);
    renderFeatures(currentProduct.dac_diem);
    renderSpecs(currentProduct);

    const products = await loadAllProducts();
    renderRelatedProducts(products);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'increase') setQuantity(quantity + 1);
            if (action === 'decrease') setQuantity(quantity - 1);
        });
    });

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!currentProduct) {
                alert("Không tìm thấy thông tin sản phẩm!");
                return;
            }
            const finalPrice = (currentProduct.gia_khuyen_mai && currentProduct.gia_khuyen_mai > 0 && currentProduct.gia_khuyen_mai < currentProduct.gia) 
                ? currentProduct.gia_khuyen_mai 
                : currentProduct.gia;
            addToCart({
                id: currentProduct.id,
                ten: currentProduct.ten,
                gia: finalPrice,
                gia_khuyen_mai: currentProduct.gia_khuyen_mai,
                hinh: currentProduct.hinh_anh_chinh || ''
            }, quantity);
        });
    }

    const buyNowBtn = document.getElementById('buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            if (!currentProduct) {
                alert("Không tìm thấy thông tin sản phẩm!");
                return;
            }
            const finalPrice = (currentProduct.gia_khuyen_mai && currentProduct.gia_khuyen_mai > 0 && currentProduct.gia_khuyen_mai < currentProduct.gia) 
                ? currentProduct.gia_khuyen_mai 
                : currentProduct.gia;
            // Thêm vào giỏ và chuyển đến trang thanh toán
            addToCart({
                id: currentProduct.id,
                ten: currentProduct.ten,
                gia: finalPrice,
                gia_khuyen_mai: currentProduct.gia_khuyen_mai,
                hinh: currentProduct.hinh_anh_chinh || ''
            }, quantity);
            setTimeout(() => {
                window.location.href = 'thanh-toan.html';
            }, 500);
        });
    }

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });
            button.classList.add('active');
            const target = button.dataset.tab;
            const pane = document.getElementById(`${target}-tab`);
            if (pane) {
                pane.classList.add('active');
                pane.style.display = 'block';
            }
        });
    });
});

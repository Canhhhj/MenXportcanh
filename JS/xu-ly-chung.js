// --- CẤU HÌNH VÀ BIẾN TOÀN CỤC ---
const API_BASE_URL = 'http://localhost:3000';
const PRODUCT_ENDPOINT = `${API_BASE_URL}/san-pham`;
const LOCAL_DATA_URL = '../duLieuSP/san-pham.json';
window.MX_API_BASE = API_BASE_URL;
// Export các hàm để các trang khác có thể sử dụng
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.formatCurrency = formatCurrency;
window.loadAllProducts = loadAllProducts;
window.normalizeProduct = normalizeProduct;
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 24; // Số lượng sản phẩm trên mỗi trang (tăng lên để hiển thị nhiều hơn)
let homeProductPage = 1;
const homeItemsPerPage = 24; // Hiển thị 24 sản phẩm/trang trên trang chủ

const PRODUCT_VARIANTS = {
    'ta-deo-chan-tay-mat-sat': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'ta-deo-chan-0-6kg', label: '0.6kg (0.3x2)', price: 244000, stock: 50 },
            { id: 'ta-deo-chan-3kg', label: '3kg (1.5x2)', price: 328000, stock: 340 },
            { id: 'ta-deo-chan-4kg', label: '4kg (2x2)', price: 390000, stock: 58 }
        ]
    },
    'bo-ta-sp124': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'bo-ta-sp124-15kg', label: '15kg', price: 1279000, stock: 107 },
            { id: 'bo-ta-sp124-20kg', label: '20kg', price: 1530000, stock: 110 },
            { id: 'bo-ta-sp124-30kg', label: '30kg', price: 1870000, stock: 134 },
            { id: 'bo-ta-sp124-40kg', label: '40kg', price: 2490000, stock: 30 },
            { id: 'bo-ta-sp124-50kg', label: '50kg', price: 2790000, stock: 19 }
        ]
    },
    'bo-ta-8-canh-sp131': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'bo-ta-sp131-10kg', label: '10kg', price: 450000, stock: 45 },
            { id: 'bo-ta-sp131-20kg', label: '20kg', price: 790000, stock: 40 },
            { id: 'bo-ta-sp131-30kg', label: '30kg', price: 990000, stock: 38 }
        ]
    },
    'bo-ta-12-canh-sp122': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'bo-ta-sp122-10kg', label: '10kg', price: 690000, stock: 80 },
            { id: 'bo-ta-sp122-20kg', label: '20kg', price: 793000, stock: 0 },
            { id: 'bo-ta-sp122-30kg', label: '30kg', price: 990000, stock: 5 },
            { id: 'bo-ta-sp122-40kg', label: '40kg', price: 1350000, stock: 5 }
        ]
    },
    'ta-loi-be-tong': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'ta-loi-bt-0-5kg', label: '0.5kg', price: 271000, stock: 279 },
            { id: 'ta-loi-bt-1kg', label: '1kg', price: 305000, stock: 39 },
            { id: 'ta-loi-bt-2kg', label: '2kg', price: 330000, stock: 98 },
            { id: 'ta-loi-bt-3kg', label: '3kg', price: 385000, stock: 8 },
            { id: 'ta-loi-bt-4kg', label: '4kg', price: 410000, stock: 80 },
            { id: 'ta-loi-bt-5kg', label: '5kg', price: 465000, stock: 15 }
        ]
    },
    'xa-don-sp008': {
        attributeLabel: 'Chọn kích thước',
        options: [
            { id: 'xa-don-sp008-72-110', label: '72-110cm', price: 335000, stock: 300 },
            { id: 'xa-don-sp008-93-140', label: '93-140cm', price: 390000, stock: 200 }
        ]
    },
    'xa-don-sp011': {
        attributeLabel: 'Chọn kích thước',
        options: [
            { id: 'xa-don-sp011-mut-ngan-80-130', label: 'Mút ngắn 80-130cm', price: 195000, stock: 140 },
            { id: 'xa-don-sp011-mut-ngan-60-100', label: 'Mút ngắn 60-100cm', price: 175000, stock: 175 },
            { id: 'xa-don-sp011-mut-dai-60-100', label: 'Mút dài 60-100cm', price: 235000, stock: 700 },
            { id: 'xa-don-sp011-mut-dai-80-130', label: 'Mút dài 80-130cm', price: 220000, stock: 700 }
        ]
    },
    'ta-am-den-sp104': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'ta-am-den-2kg', label: '2kg', price: 343000, stock: 99 },
            { id: 'ta-am-den-4kg', label: '4kg', price: 430000, stock: 476 },
            { id: 'ta-am-den-6kg', label: '6kg', price: 470000, stock: 109 },
            { id: 'ta-am-den-8kg', label: '8kg', price: 510000, stock: 61 },
            { id: 'ta-am-den-10kg', label: '10kg', price: 558000, stock: 29 },
            { id: 'ta-am-den-12kg', label: '12kg', price: 690000, stock: 131 }
        ]
    },
    'tui-deo-hong-sp041': {
        attributeLabel: 'Chọn màu sắc',
        options: [
            { id: 'tui-deo-hong-cam', label: 'Cam', price: 99000, stock: 873 },
            { id: 'tui-deo-hong-hong', label: 'Hồng', price: 99000, stock: 690 },
            { id: 'tui-deo-hong-xanh-duong', label: 'Xanh dương', price: 99000, stock: 400 },
            { id: 'tui-deo-hong-xanh-la', label: 'Xanh lá', price: 99000, stock: 766 }
        ]
    },
    'day-nhay-sp003': {
        attributeLabel: 'Chọn màu sắc',
        options: [
            { id: 'day-nhay-den-den', label: 'Đen/Đen', price: 99000, stock: 1580 },
            { id: 'day-nhay-den-do', label: 'Đen/Đỏ', price: 99000, stock: 1200 },
            { id: 'day-nhay-den-xanh-la', label: 'Đen/Xanh lá', price: 99000, stock: 570 },
            { id: 'day-nhay-den-xanh-duong', label: 'Đen/Xanh dương', price: 99000, stock: 1188 }
        ]
    },
    'day-khang-sp001': {
        attributeLabel: 'Chọn màu sắc',
        options: [
            { id: 'day-khang-xanh-la', label: 'Xanh lá', price: 290000, stock: 1360 },
            { id: 'day-khang-tim', label: 'Tím', price: 260000, stock: 3000 },
            { id: 'day-khang-den', label: 'Đen', price: 190000, stock: 1600 },
            { id: 'day-khang-do', label: 'Đỏ', price: 150000, stock: 375 },
            { id: 'day-khang-vang', label: 'Vàng', price: 99000, stock: 300 }
        ]
    },
    'gay-bong-chay-sp023': {
        attributeLabel: 'Chọn mẫu',
        options: [
            { id: 'gay-bong-chay-bac', label: 'Gậy màu bạc', price: 290000, stock: 170 },
            { id: 'gay-bong-chay-do', label: 'Gậy màu đỏ', price: 290000, stock: 500 },
            { id: 'gay-bong-chay-den', label: 'Gậy màu đen', price: 290000, stock: 500 },
            { id: 'gay-bong-chay-tui', label: 'Túi đựng gậy', price: 90000, stock: 8 }
        ]
    },
    'ta-deo-chan-buffalo': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'buffalo-chan-2kg', label: '2kg', price: 379000 },
            { id: 'buffalo-chan-3kg', label: '3kg', price: 449000 },
            { id: 'buffalo-chan-4kg', label: '4kg', price: 479000 },
            { id: 'buffalo-chan-5kg', label: '5kg', price: 549000 },
            { id: 'buffalo-chan-6kg', label: '6kg', price: 579000 },
            { id: 'buffalo-chan-8kg', label: '8kg', price: 779000 },
            { id: 'buffalo-chan-10kg', label: '10kg', price: 839000 }
        ]
    },
    'ta-deo-tay-buffalo': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'buffalo-tay-2kg', label: '2kg', price: 290000 },
            { id: 'buffalo-tay-3kg', label: '3kg', price: 350000 },
            { id: 'buffalo-tay-4kg', label: '4kg', price: 399000 }
        ]
    },
    'ao-ta-mang-nguoi': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'ao-ta-5kg', label: '5kg', price: 799000 },
            { id: 'ao-ta-10kg', label: '10kg', price: 999000 },
            { id: 'ao-ta-15kg', label: '15kg', price: 1399000 },
            { id: 'ao-ta-20kg', label: '20kg', price: 1799000 }
        ]
    },
    'chi-deo-chan': {
        attributeLabel: 'Chọn cân nặng',
        options: [
            { id: 'chi-chan-2kg', label: '~2kg', price: 270000 },
            { id: 'chi-chan-3kg', label: '3kg', price: 290000 },
            { id: 'chi-chan-4kg', label: '4kg', price: 350000 }
        ]
    },
    'chi-deo-tay': {
        attributeLabel: 'Chọn mẫu',
        options: [
            { id: 'chi-tay-1-5kg', label: 'Chì đeo tay 1.5kg', price: 240000 },
            { id: 'chi-tay-2kg', label: 'Chì đeo tay ~2kg', price: 280000 },
            { id: 'vo-chi-tay', label: 'Vỏ chì chân - tay', price: 130000 }
        ]
    },
    'gay-be-co-tay-sp095': {
        attributeLabel: 'Chọn lực',
        options: [
            { id: 'gay-be-co-tay-30kg', label: '30kg', price: 261200 }
        ]
    }
};

function initVariantSelector(config = {}) {
    if (!config.key) {
        // Nếu không có key, tạo variant mặc định từ baseConfig
        const container = config.container || document.querySelector('.variant-selector');
        if (!container) return null;
        
        const baseConfig = config.baseConfig || {};
        const defaultVariant = {
            id: baseConfig.id || 'default',
            label: 'Mặc định',
            price: baseConfig.gia_khuyen_mai || baseConfig.price || baseConfig.gia || 0,
            image: baseConfig.image || baseConfig.hinh_anh_chinh
        };
        
        container.classList.add('variant-selector');
        container.style.display = 'none'; // Ẩn nếu chỉ có 1 variant
        
        return {
            getSelectedVariant: () => defaultVariant
        };
    }
    
    const variantData = PRODUCT_VARIANTS[config.key];
    
    // Nếu không có variant data, tạo variant mặc định
    if (!variantData) {
        const container = config.container || document.querySelector(`[data-variant-key="${config.key}"]`);
        if (!container) return null;
        
        const baseConfig = config.baseConfig || {};
        const defaultVariant = {
            id: baseConfig.id || 'default',
            label: 'Mặc định',
            price: baseConfig.gia_khuyen_mai || baseConfig.price || baseConfig.gia || 0,
            image: baseConfig.image || baseConfig.hinh_anh_chinh
        };
        
        container.classList.add('variant-selector');
        container.style.display = 'none'; // Ẩn nếu chỉ có 1 variant
        
        return {
            getSelectedVariant: () => defaultVariant
        };
    }

    const container = config.container || document.querySelector(`[data-variant-key="${config.key}"]`);
    if (!container) return null;

    container.classList.add('variant-selector');
    container.innerHTML = '';

    if (variantData.attributeLabel) {
        const labelEl = document.createElement('label');
        labelEl.textContent = variantData.attributeLabel;
        container.appendChild(labelEl);
    }

    const selectEl = document.createElement('select');
    variantData.options.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.value = option.id;
        optionEl.textContent = option.label;
        selectEl.appendChild(optionEl);
    });
    container.appendChild(selectEl);

    let currentVariant = variantData.options[0];
    const applyVariant = (variant) => {
        currentVariant = variant;
        if (config.priceElement && variant && typeof variant.price !== 'undefined') {
            config.priceElement.textContent = formatCurrency(variant.price);
        }
        if (typeof config.onChange === 'function') {
            config.onChange(variant);
        }
    };

    const defaultOptionId = config.defaultOptionId || (container && container.dataset.defaultVariant);
    if (defaultOptionId) {
        const foundDefault = variantData.options.find(opt => opt.id === defaultOptionId);
        if (foundDefault) {
            currentVariant = foundDefault;
        }
    }
    if (currentVariant) {
        selectEl.value = currentVariant.id;
        applyVariant(currentVariant);
    }

    selectEl.addEventListener('change', () => {
        const found = variantData.options.find(opt => opt.id === selectEl.value);
        if (found) {
            applyVariant(found);
        }
    });

    return {
        getSelectedVariant: () => currentVariant
    };
}

function buildProductPayload(baseConfig = {}, variantState, quantity) {
    const selectedVariant = variantState ? variantState.getSelectedVariant() : null;
    const name = selectedVariant
        ? `${baseConfig.baseName || baseConfig.defaultName || ''} - ${selectedVariant.label}`
        : baseConfig.baseName || baseConfig.defaultName || '';

    return {
        id: selectedVariant ? selectedVariant.id : baseConfig.id,
        ten: name.trim() || baseConfig.ten,
        gia: selectedVariant ? selectedVariant.price : baseConfig.price,
        gia_khuyen_mai: selectedVariant ? selectedVariant.price : (baseConfig.gia_khuyen_mai || baseConfig.price),
        hinh: selectedVariant && selectedVariant.image ? selectedVariant.image : baseConfig.image,
        soLuong: quantity
    };
}

window.PRODUCT_VARIANTS = PRODUCT_VARIANTS;
window.initVariantSelector = initVariantSelector;
window.buildProductPayload = buildProductPayload;

// --- HÀM TIỆN ÍCH CHUNG ---

// Định dạng tiền tệ
function formatCurrency(number) {
    if (typeof number !== 'number' || Number.isNaN(number)) return number;
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Hàm cập nhật số lượng giỏ hàng trên Header (Chạy trên mọi trang)
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;

    let giohang = [];
    try {
        giohang = JSON.parse(localStorage.getItem('giohang') || '[]');
    } catch (e) {
        console.error("Lỗi khi đọc giỏ hàng:", e);
    }
    
    // Đếm số loại sản phẩm (như phong cách Kingsport)
    cartCountElement.textContent = giohang.length; 
}


// --- LOGIC GIO HÀNG CHUNG (Dùng cho cả Trang Chủ và Chi Tiết) ---

function addToCart(product, quantity) {
    let giohang = [];
    try {
        giohang = JSON.parse(localStorage.getItem('giohang') || '[]');
    } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng:", error);
        giohang = [];
    }

    // Xác định giá: ưu tiên giá khuyến mãi nếu có và nhỏ hơn giá gốc
    const finalPrice = (product.gia_khuyen_mai && product.gia_khuyen_mai > 0 && product.gia_khuyen_mai < product.gia) 
        ? product.gia_khuyen_mai 
        : product.gia;

    const sanPhamMoi = {
        id: product.id,
        ten: product.ten,
        gia: finalPrice,
        hinh: product.hinh || product.hinh_anh_chinh || '', 
        soLuong: quantity || 1
    };
    
    let sanPhamDaCo = giohang.find(p => p.id === sanPhamMoi.id);

    if (sanPhamDaCo) {
        sanPhamDaCo.soLuong += (quantity || 1);
    } else {
        giohang.push(sanPhamMoi);
    }

    try {
        localStorage.setItem('giohang', JSON.stringify(giohang));
        updateCartCount(); // Cập nhật Header
        alert(`Đã thêm ${sanPhamMoi.soLuong} sản phẩm "${product.ten}" vào giỏ hàng!`);
    } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng:", error);
        alert("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!");
    }
}


// --- LOGIC CHÍNH: TẢI VÀ XỬ LÝ DỮ LIỆU ---

function normalizeProduct(product) {
    const gia = Number(product.gia) || 0;
    const sale = Number(product.gia_khuyen_mai);
    return {
        ...product,
        gia,
        gia_khuyen_mai: sale && sale > 0 ? sale : gia,
        mo_ta_ngan: product.mo_ta_ngan || product.moTa || '',
        hinh_anh_chinh: product.hinh_anh_chinh || product.hinh || '',
        tags: product.tags || [],
        dac_diem: product.dac_diem || []
    };
}

async function fetchProductsFrom(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Không thể tải dữ liệu: ${response.statusText}`);
    const data = await response.json();
    return data.map(normalizeProduct);
}

async function loadAllProducts() {
    if (allProducts.length) {
        console.log(`Đã có ${allProducts.length} sản phẩm trong cache`);
        return allProducts;
    }
    try {
        allProducts = await fetchProductsFrom(PRODUCT_ENDPOINT);
        console.log(`Đã tải ${allProducts.length} sản phẩm từ API`);
    } catch (apiError) {
        console.warn('API không phản hồi, dùng dữ liệu tĩnh.', apiError);
        try {
            allProducts = await fetchProductsFrom(LOCAL_DATA_URL);
            console.log(`Đã tải ${allProducts.length} sản phẩm từ file JSON`);
        } catch (localError) {
            console.error("Lỗi khi tải dữ liệu sản phẩm:", localError);
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) loadingMessage.textContent = 'Không thể tải sản phẩm. Vui lòng thử lại sau.';
            return [];
        }
    }

    if (document.getElementById('product-list-container')) {
        setupProductList();
    }

    if (document.body.classList.contains('home-page')) {
        renderHomeSections();
    }

    return allProducts;
}

// --- LOGIC TRANG DANH SÁCH SẢN PHẨM (san-pham.html) ---

function setupProductList() {
    // 1. Khởi tạo giá trị lọc ban đầu
    const priceSlider = document.getElementById('price-slider');
    priceSlider.max = 50000000; // Giả sử max là 50 triệu
    priceSlider.value = priceSlider.max;
    document.getElementById('current-max-price').textContent = formatCurrency(priceSlider.value);
    
    // 2. Lắng nghe sự kiện
    priceSlider.addEventListener('input', () => {
        document.getElementById('current-max-price').textContent = formatCurrency(parseInt(priceSlider.value));
    });
    
    document.getElementById('apply-filter').addEventListener('click', () => {
        currentPage = 1; // Reset về trang 1 khi lọc
        renderProductList();
    });

    document.getElementById('sort-by').addEventListener('change', () => {
        currentPage = 1; // Reset về trang 1 khi sắp xếp
        renderProductList();
    });

    document.querySelectorAll('#category-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('#category-list a').forEach(i => i.classList.remove('active'));
            link.classList.add('active');
            currentPage = 1; // Reset về trang 1 khi đổi danh mục
            renderProductList();
        });
    });

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    if (initialCategory) {
        const target = document.querySelector(`#category-list a[data-category="${initialCategory}"]`);
        if (target) {
            document.querySelectorAll('#category-list a').forEach(i => i.classList.remove('active'));
            target.classList.add('active');
        }
    }

    // Lần render đầu tiên
    renderProductList();
}


function getFilteredAndSortedProducts() {
    let filteredProducts = [...allProducts];
    
    // --- B0: LỌC THEO TỪ KHÓA TÌM KIẾM ---
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.ten.toLowerCase().includes(query) ||
            (p.mo_ta_ngan && p.mo_ta_ngan.toLowerCase().includes(query)) ||
            (p.brand && p.brand.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query))
        );
    }
    
    // --- B1: LỌC THEO DANH MỤC ---
    const activeCategoryElement = document.querySelector('#category-list a.active');
    const category = activeCategoryElement ? activeCategoryElement.getAttribute('data-category') : 'all';
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category); // Cần trường 'category' trong JSON
    }

    // --- B2: LỌC THEO GIÁ ---
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        const maxPrice = parseInt(priceSlider.value) || 50000000;
        filteredProducts = filteredProducts.filter(p => p.gia <= maxPrice);
    }

    // --- B3: SẮP XẾP ---
    const sortByEl = document.getElementById('sort-by');
    if (sortByEl) {
        const sortBy = sortByEl.value;
        switch (sortBy) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.gia - b.gia);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.gia - a.gia);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.ten.localeCompare(b.ten));
                break;
            case 'default':
            default:
                // Giữ nguyên thứ tự ban đầu hoặc theo ID
                break;
        }
    }

    return filteredProducts;
}

function renderProductList() {
    const productsToRender = getFilteredAndSortedProducts();
    const totalPages = Math.ceil(productsToRender.length / itemsPerPage);
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    // Hiển thị thông tin tìm kiếm nếu có
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    const searchInfo = document.getElementById('search-results-info');
    const searchText = document.getElementById('search-query-text');
    if (searchQuery && searchInfo && searchText) {
        searchInfo.style.display = 'block';
        searchText.textContent = `Kết quả tìm kiếm cho "${searchQuery}": ${productsToRender.length} sản phẩm`;
    } else if (searchInfo) {
        searchInfo.style.display = 'none';
    }
    
    // --- Xử lý Phân trang ---
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToRender.slice(startIndex, endIndex);

    // --- Render Sản phẩm ---
    const productListContainer = document.getElementById('product-list-container');
    if (paginatedProducts.length === 0) {
        productListContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">Không tìm thấy sản phẩm nào phù hợp với tiêu chí lọc.</p>';
    } else {
        // Sử dụng lại hàm tạo card sản phẩm từ logic Trang Chủ (Phải đảm bảo hàm này có)
        productListContainer.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    }

    // --- Render Phân trang ---
    renderPagination(totalPages);
    
    // --- Thiết lập lại Listener cho nút "Mua Ngay" mới được tạo ---
    setupBuyNowListeners();
}

function renderPagination(totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderProductList();
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        });
        paginationControls.appendChild(button);
    }
}


// --- LOGIC TRANG CHỦ (Tái sử dụng logic render) ---

// Hàm tạo mã HTML cho một thẻ sản phẩm (Phải tồn tại trong file JS chung)
function buildPriceBlock(product) {
    const hasSale = product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia;
    if (hasSale) {
        return `
            <div class="price-group">
                <span class="current-price">${formatCurrency(product.gia_khuyen_mai)}</span>
                <span class="old-price">${formatCurrency(product.gia)}</span>
            </div>
        `;
    }
    return `
        <div class="price-group">
            <span class="current-price">${formatCurrency(product.gia)}</span>
        </div>
    `;
}

function createProductCard(product) {
    const badge = product.badge ? `<span class="discount-badge">${product.badge}</span>` : '';
    const priceBlock = buildPriceBlock(product);
    // Xác định link chi tiết: nếu có detail_page thì dùng, không thì dùng trang động
    const detailLink = product.detail_page ? product.detail_page : `chitetsanpham.html?id=${product.id}`;
    return `
        <article class="product-card">
            <div class="product-thumb">
                ${badge}
                <a href="${detailLink}">
                    <img src="${product.hinh_anh_chinh}" alt="${product.ten}" onerror="this.src='../taiNguyen/img/logo/logomenxport.png'">
                </a>
            </div>
            <div class="product-info">
                <p class="product-brand">${product.brand || 'MENXPORT'}</p>
                <h4><a href="${detailLink}">${product.ten}</a></h4>
                <p class="product-desc">${product.mo_ta_ngan || ''}</p>
                ${priceBlock}
                <div class="product-actions">
                    <button class="btn btn-primary btn-add-to-cart"
                            data-id="${product.id}"
                            data-ten="${product.ten}"
                            data-gia="${product.gia_khuyen_mai && product.gia_khuyen_mai > 0 && product.gia_khuyen_mai < product.gia ? product.gia_khuyen_mai : product.gia}"
                            data-hinh="${product.hinh_anh_chinh}">
                        Thêm vào giỏ
                    </button>
                    <button class="btn btn-secondary btn-buy-now"
                            data-id="${product.id}"
                            data-ten="${product.ten}"
                            data-gia="${product.gia_khuyen_mai && product.gia_khuyen_mai > 0 && product.gia_khuyen_mai < product.gia ? product.gia_khuyen_mai : product.gia}"
                            data-hinh="${product.hinh_anh_chinh}">
                        Mua ngay
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Hàm thiết lập lắng nghe sự kiện cho các nút "Thêm vào giỏ" và "Mua ngay"
function setupBuyNowListeners() {
    // Xử lý nút "Thêm vào giỏ"
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productData = {
                id: this.getAttribute('data-id'),
                ten: this.getAttribute('data-ten'),
                gia: parseInt(this.getAttribute('data-gia')) || 0,
                hinh: this.getAttribute('data-hinh') || ''
            };
            if (!productData.id || !productData.ten) {
                console.error("Thiếu thông tin sản phẩm:", productData);
                alert("Có lỗi xảy ra. Vui lòng thử lại!");
                return;
            }
            addToCart(productData, 1);
        });
    });

    // Xử lý nút "Mua ngay"
    document.querySelectorAll('.btn-buy-now').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productData = {
                id: this.getAttribute('data-id'),
                ten: this.getAttribute('data-ten'),
                gia: parseInt(this.getAttribute('data-gia')) || 0,
                hinh: this.getAttribute('data-hinh') || ''
            };
            if (!productData.id || !productData.ten) {
                console.error("Thiếu thông tin sản phẩm:", productData);
                alert("Có lỗi xảy ra. Vui lòng thử lại!");
                return;
            }
            // Thêm vào giỏ và chuyển đến trang thanh toán
            addToCart(productData, 1);
            setTimeout(() => {
                window.location.href = 'thanh-toan.html';
            }, 500);
        });
    });
}

// --- KHỞI TẠO TỔNG THỂ ---

function renderProductSection(targetId, products) {
    const container = document.getElementById(targetId);
    if (!container) return;
    if (!products || !products.length) {
        container.innerHTML = '<p class="empty-note">Đang cập nhật sản phẩm...</p>';
        return;
    }
    container.innerHTML = products.map(createProductCard).join('');
    setupBuyNowListeners();
}

// Export hàm để các file khác sử dụng
window.renderProductSection = renderProductSection;
window.createProductCard = createProductCard;
window.setupBuyNowListeners = setupBuyNowListeners;

function renderHomeProductList() {
    const grid = document.getElementById('home-all-products-grid');
    const pagination = document.getElementById('home-products-pagination');
    if (!grid || !pagination) return;

    if (!allProducts.length) {
        grid.innerHTML = '<p class="empty-note">Đang cập nhật sản phẩm...</p>';
        pagination.innerHTML = '';
        return;
    }

    // Loại bỏ sản phẩm trùng lặp dựa trên ID
    const uniqueProducts = [];
    const seenIds = new Set();
    for (const product of allProducts) {
        if (!seenIds.has(product.id)) {
            seenIds.add(product.id);
            uniqueProducts.push(product);
        }
    }

    const totalPages = Math.max(1, Math.ceil(uniqueProducts.length / homeItemsPerPage));
    if (homeProductPage > totalPages) {
        homeProductPage = totalPages;
    }

    const startIndex = (homeProductPage - 1) * homeItemsPerPage;
    const paginated = uniqueProducts.slice(startIndex, startIndex + homeItemsPerPage);

    grid.innerHTML = paginated.map(createProductCard).join('');
    setupBuyNowListeners();

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === homeProductPage) button.classList.add('active');
        button.addEventListener('click', () => {
            homeProductPage = i;
            renderHomeProductList();
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        pagination.appendChild(button);
    }
}

function renderHomeSections() {
    if (!allProducts.length) return;
    
    // 1. Spotlight: Chỉ hiển thị 3 sản phẩm đầu tiên có flash-sale hoặc new tag
    const spotlight = allProducts
        .filter(p => p.tags && (p.tags.includes('flash-sale') || p.tags.includes('new')))
        .slice(0, 3);
    
    // 2. Best Sellers: Chỉ hiển thị sp1, sp5, sp9 (theo detail_page)
    const bestSellerIds = ['chitietsp/sp1.html', 'chitietsp/sp5.html', 'chitietsp/sp9.html'];
    const bestSellers = allProducts
        .filter(p => bestSellerIds.includes(p.detail_page))
        .slice(0, 3);
    
    // 3. Combo (Lắp đặt): Chỉ hiển thị 4 sản phẩm cần lắp đặt
    // Sản phẩm cần lắp đặt là những sản phẩm có "Lắp đặt" trong dac_diem và không có "Không cần"
    const comboSets = allProducts
        .filter(p => {
            if (!p.dac_diem || !Array.isArray(p.dac_diem)) return false;
            return p.dac_diem.some(d => 
                typeof d === 'string' && 
                d.includes('Lắp đặt') && 
                !d.includes('Không cần')
            );
        })
        .slice(0, 4);
    
    // Render các section
    renderProductSection('spotlight-grid', spotlight);
    renderProductSection('best-seller-grid', bestSellers);
    renderProductSection('combo-grid', comboSets);
    renderHomeProductList();
    
    // Xử lý tabs trong section "Sản phẩm bán chạy"
    setupBestSellerTabs();
}

function setupBestSellerTabs() {
    const tabs = document.querySelectorAll('.section-tabs button');
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Xóa active class từ tất cả tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Thêm active class cho tab được click
            this.classList.add('active');
            
            // Lọc sản phẩm theo tab
            let filteredProducts = [];
            const tabText = this.textContent.trim();
            
            if (tabText === 'Tạ tay') {
                // Lọc sản phẩm có category là 'ta-don' hoặc tên chứa 'tạ'
                filteredProducts = allProducts.filter(p => 
                    p.category === 'ta-don' || 
                    p.ten.toLowerCase().includes('tạ') ||
                    (p.tags && p.tags.includes('ta-don'))
                );
            } else if (tabText === 'Combo') {
                filteredProducts = allProducts.filter(p => 
                    p.category === 'combo' || 
                    p.ten.toLowerCase().includes('combo') ||
                    (p.tags && p.tags.includes('combo'))
                );
            } else if (tabText === 'Phụ kiện') {
                filteredProducts = allProducts.filter(p => 
                    p.category === 'phu-kien' || 
                    p.ten.toLowerCase().includes('phụ kiện') ||
                    p.ten.toLowerCase().includes('boxing') ||
                    (p.tags && p.tags.includes('phu-kien'))
                );
            }
            
            // Nếu không có sản phẩm theo filter, hiển thị tất cả
            if (filteredProducts.length === 0) {
                filteredProducts = allProducts;
            }
            
            // Render lại section best-seller-grid
            renderProductSection('best-seller-grid', filteredProducts);
        });
    });
}

function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    let index = 0;

    const activate = (i) => {
        slides.forEach((slide, idx) => slide.classList.toggle('active', idx === i));
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
        index = i;
    };

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => activate(idx));
    });

    setInterval(() => {
        const next = (index + 1) % slides.length;
        activate(next);
    }, 6000);
}

function initHeaderInteractions() {
    const header = document.querySelector('.site-header');
    const onScroll = () => {
        if (!header) return;
        header.classList.toggle('compact', window.scrollY > 60);
    };
    if (header) {
        onScroll();
        window.addEventListener('scroll', onScroll);
    }
    
    // Xử lý tìm kiếm sản phẩm
    const searchInputs = document.querySelectorAll('.search-field input[type="text"]');
    searchInputs.forEach(input => {
        const searchBtn = input.nextElementSibling;
        const performSearch = () => {
            const query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                alert('Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!');
                return;
            }
            window.location.href = `san-pham.html?search=${encodeURIComponent(query)}`;
        };
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
    
    // Xử lý form đăng ký email
    document.querySelectorAll('.subscribe-form').forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (!email) {
                alert('Vui lòng nhập email!');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Email không hợp lệ! Vui lòng kiểm tra lại.');
                return;
            }
            
            alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin ưu đãi đến email của bạn.');
            if (emailInput) emailInput.value = '';
        });
    });

    const trigger = document.getElementById('category-menu-trigger');
    const dropdown = document.getElementById('category-dropdown');
    
    if (trigger && dropdown) {
        let isOpen = false;
        
        trigger.addEventListener('click', async (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            
            if (isOpen) {
                dropdown.style.display = 'block';
                // Load sản phẩm vào dropdown - chỉ hiển thị tên
                const products = await loadAllProducts();
                const productsList = document.getElementById('dropdown-products');
                if (productsList && products.length > 0) {
                    productsList.innerHTML = products.map(product => {
                        const detailLink = product.detail_page || `chitetsanpham.html?id=${product.id}`;
                        return `
                            <div class="dropdown-product-item">
                                <a href="${detailLink}">
                                    <span class="dropdown-product-name">${product.ten}</span>
                                </a>
                            </div>
                        `;
                    }).join('');
                    document.querySelector('.dropdown-loading').style.display = 'none';
                }
            } else {
                dropdown.style.display = 'none';
            }
        });

        // Đóng dropdown khi click bên ngoài
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                isOpen = false;
            }
        });
    } else {
        // Fallback cho các trang không có dropdown
        const oldTrigger = document.querySelector('.menu-trigger');
        if (oldTrigger) {
            oldTrigger.addEventListener('click', () => {
                const panel = document.querySelector('.category-panel');
                if (panel) {
                    panel.classList.add('pulse');
                    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => panel.classList.remove('pulse'), 800);
                } else {
                    window.location.href = 'san-pham.html';
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    await loadAllProducts();
    if (document.body.classList.contains('home-page')) {
        initHeroSlider();
    }
    initHeaderInteractions();
});
const fs = require('fs');
const path = require('path');

// Mapping từ detail_page sang variant key và base config
const variantConfigMap = {
    'chitietsp/sp1.html': {
        key: 'bo-ta-8-canh-sp131',
        baseConfig: {
            baseName: 'Bộ Tạ 8 Cạnh DKS',
            defaultName: 'Bộ Tạ 8 Cạnh DKS 20KG',
            id: 'bo-ta-8-canh-dks',
            price: 1650000,
            gia_khuyen_mai: 1350000,
            image: '../../taiNguyen/img/sanpham/sp1.7.Bộ tạ (8 cạnh)/1.webp'
        }
    },
    'chitietsp/sp2.html': {
        key: 'xa-don-sp011',
        baseConfig: {
            baseName: 'Thanh Đòn Cầm Tay MX',
            defaultName: 'Thanh Đòn Cầm Tay MX 35cm',
            id: 'thanh-don-35cm-mx',
            price: 450000,
            gia_khuyen_mai: 390000,
            image: '../../taiNguyen/img/sanpham/sp2.Thanh đòn cầm tay 35cm/1.webp'
        }
    },
    'chitietsp/sp3.html': {
        key: null,
        baseConfig: {
            baseName: 'Kẹp Bóp Tay Thép Pro',
            defaultName: 'Kẹp Bóp Tay Thép Pro 70lbs',
            id: 'kep-bop-tay-thep-pro',
            price: 320000,
            gia_khuyen_mai: 260000,
            image: '../../taiNguyen/img/sanpham/sp3.15.Dụng cụ tập tay/1.webp'
        }
    }
    // Thêm các sản phẩm khác nếu cần
};

const spDir = path.join(__dirname, '../giaoDien/chitietsp');
const files = fs.readdirSync(spDir).filter(f => f.match(/^sp\d+\.html$/)).sort((a, b) => {
    const numA = parseInt(a.match(/sp(\d+)/)[1]);
    const numB = parseInt(b.match(/sp(\d+)/)[1]);
    return numA - numB;
});

files.forEach(file => {
    const filePath = path.join(spDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Kiểm tra xem đã có initVariantSelector chưa
    if (content.includes('initVariantSelector')) {
        console.log(`✓ ${file} đã có initVariantSelector`);
        return;
    }
    
    const detailPage = `chitietsp/${file}`;
    const config = variantConfigMap[detailPage];
    
    // Tìm vị trí để chèn code (sau let quantity = 1;)
    const quantityMatch = content.match(/(let quantity = 1;)/);
    if (!quantityMatch) {
        console.log(`⚠ ${file}: Không tìm thấy "let quantity = 1;"`);
        return;
    }
    
    // Tạo code để khởi tạo variant selector
    let initCode = '';
    if (config && config.key) {
        initCode = `
        const priceElement = document.querySelector('.price-section .current-price');
        const variantState = window.initVariantSelector ? window.initVariantSelector({
            key: '${config.key}',
            priceElement
        }) : null;
        const baseProductConfig = ${JSON.stringify(config.baseConfig, null, 12)};
`;
    } else {
        // Tạo variant mặc định
        const baseConfig = config?.baseConfig || {
            baseName: 'Sản phẩm',
            defaultName: 'Sản phẩm',
            id: 'default',
            price: 0,
            gia_khuyen_mai: 0,
            image: ''
        };
        initCode = `
        const priceElement = document.querySelector('.price-section .current-price');
        const variantState = window.initVariantSelector ? window.initVariantSelector({
            key: '',
            priceElement,
            baseConfig: ${JSON.stringify(baseConfig, null, 12)}
        }) : null;
        const baseProductConfig = ${JSON.stringify(baseConfig, null, 12)};
`;
    }
    
    // Chèn code sau "let quantity = 1;"
    const newContent = content.replace(
        /(let quantity = 1;)/,
        '$1' + initCode
    );
    
    // Cập nhật hàm addToCart để sử dụng buildProductPayload
    if (!content.includes('buildProductPayload')) {
        const addToCartMatch = content.match(/(function addToCart\(\) \{[\s\S]*?)(const product = \{)/);
        if (addToCartMatch) {
            const addToCartReplacement = `function addToCart() {
            const product = typeof window.buildProductPayload === 'function'
                ? window.buildProductPayload(baseProductConfig, variantState, quantity)
                : {
                    id: baseProductConfig.id,
                    ten: baseProductConfig.defaultName || baseProductConfig.baseName,
                    gia: baseProductConfig.price,
                    gia_khuyen_mai: baseProductConfig.gia_khuyen_mai || baseProductConfig.price,
                    hinh: baseProductConfig.image,
                    soLuong: quantity
                };
            if (typeof window.addToCart === 'function') {
                window.addToCart(product, quantity);
            } else {
                let giohang = JSON.parse(localStorage.getItem('giohang') || '[]');
                const finalPrice = product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia ? product.gia_khuyen_mai : product.gia;
                const sanPhamMoi = { id: product.id, ten: product.ten, gia: finalPrice, hinh: product.hinh, soLuong: quantity };
                const existing = giohang.find(p => p.id === sanPhamMoi.id);
                if (existing) existing.soLuong += quantity;
                else giohang.push(sanPhamMoi);
                localStorage.setItem('giohang', JSON.stringify(giohang));
                alert(\`Đã thêm \${quantity} sản phẩm "\${product.ten}" vào giỏ hàng!\`);
                if (typeof updateCartCount === 'function') updateCartCount();
            }
        }`;
            
            const finalContent = newContent.replace(
                /function addToCart\(\) \{[\s\S]*?\n        \}/,
                addToCartReplacement
            );
            
            fs.writeFileSync(filePath, finalContent, 'utf8');
            console.log(`✓ Đã cập nhật ${file} với variant selector init`);
        } else {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✓ Đã thêm variant selector init vào ${file}`);
        }
    } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✓ Đã thêm variant selector init vào ${file}`);
    }
});

console.log('\nHoàn thành!');


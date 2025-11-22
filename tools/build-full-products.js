const fs = require('fs');
const path = require('path');

// Đọc tất cả file sp*.html và extract thông tin
const spDir = path.join(__dirname, '../giaoDien/chitietsp');
const files = fs.readdirSync(spDir).filter(f => f.match(/^sp\d+\.html$/)).sort((a, b) => {
    const numA = parseInt(a.match(/sp(\d+)/)[1]);
    const numB = parseInt(b.match(/sp(\d+)/)[1]);
    return numA - numB;
});

const products = [];

files.forEach(file => {
    const filePath = path.join(spDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract thông tin từ HTML
    const titleMatch = content.match(/<title>(.*?)\s*\|/);
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
    const brandMatch = content.match(/<p class="product-brand">(.*?)<\/p>/);
    const priceMatch = content.match(/<span class="current-price">([\d.,]+)₫<\/span>/);
    const oldPriceMatch = content.match(/<span class="old-price">([\d.,]+)₫<\/span>/);
    const badgeMatch = content.match(/<span class="badge">(.*?)<\/span>/);
    const descMatch = content.match(/<p[^>]*class="product-info"[^>]*>[\s\S]*?<p>(.*?)<\/p>/);
    const mainImageMatch = content.match(/<img id="main-image"[^>]*src="([^"]+)"/);
    const detailPage = `chitietsp/${file}`;
    
    const spNum = parseInt(file.match(/sp(\d+)/)[1]);
    
    // Extract tên sản phẩm
    const ten = h1Match ? h1Match[1].trim() : (titleMatch ? titleMatch[1].trim() : `Sản phẩm ${spNum}`);
    
    // Extract giá
    let gia = 0;
    let gia_khuyen_mai = 0;
    if (priceMatch) {
        const priceStr = priceMatch[1].replace(/\./g, '');
        gia_khuyen_mai = parseInt(priceStr);
        gia = gia_khuyen_mai;
    }
    if (oldPriceMatch) {
        const oldPriceStr = oldPriceMatch[1].replace(/\./g, '');
        gia = parseInt(oldPriceStr);
    }
    
    // Extract badge
    const badge = badgeMatch ? badgeMatch[1].trim() : null;
    
    // Extract mô tả - tìm trong product-info section
    let mo_ta_ngan = '';
    const productInfoMatch = content.match(/<div class="product-info">[\s\S]*?<p>(.*?)<\/p>/);
    if (productInfoMatch) {
        mo_ta_ngan = productInfoMatch[1].trim();
    }
    // Nếu không tìm thấy, thử tìm trong các thẻ p khác
    if (!mo_ta_ngan) {
        const pMatches = content.matchAll(/<p[^>]*>(.*?)<\/p>/g);
        for (const match of pMatches) {
            const text = match[1].trim();
            if (text && text.length > 20 && text.length < 200 && !text.includes('<')) {
                mo_ta_ngan = text;
                break;
            }
        }
    }
    
    // Extract hình ảnh
    let hinh_anh_chinh = mainImageMatch ? mainImageMatch[1] : '';
    // Convert relative path
    if (hinh_anh_chinh && hinh_anh_chinh.startsWith('../../')) {
        hinh_anh_chinh = hinh_anh_chinh.replace('../../', '../');
    }
    
    // Extract thumbnails
    const thumbnailMatches = content.matchAll(/<img[^>]*src="([^"]+)"[^>]*onclick="changeImage/g);
    const hinh_anh_phu = [];
    for (const match of thumbnailMatches) {
        let imgPath = match[1];
        if (imgPath.startsWith('../../')) {
            imgPath = imgPath.replace('../../', '../');
        }
        if (imgPath !== hinh_anh_chinh) {
            hinh_anh_phu.push(imgPath);
        }
    }
    
    // Extract đặc điểm
    const featureMatches = content.matchAll(/<li><i[^>]*><\/i>\s*(.*?)<\/li>/g);
    const dac_diem = [];
    for (const match of featureMatches) {
        dac_diem.push(match[1].trim());
    }
    
    // Xác định category dựa trên tên sản phẩm
    let category = 'ta-don';
    const tenLower = ten.toLowerCase();
    if (tenLower.includes('combo')) {
        category = 'combo';
    } else if (tenLower.includes('bánh tạ') || tenLower.includes('plate') || tenLower.includes('bộ tạ')) {
        category = 'banh-ta';
    } else if (tenLower.includes('phụ kiện') || tenLower.includes('boxing') || tenLower.includes('gậy') || tenLower.includes('kẹp') || tenLower.includes('túi') || tenLower.includes('chì')) {
        category = 'phu-kien';
    }
    
    // Xác định tags
    const tags = [];
    if (badge) tags.push('flash-sale');
    if (spNum <= 5) tags.push('best-seller');
    if (category === 'combo') tags.push('combo');
    
    // Tạo ID
    const id = `sp${spNum}-${ten.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)}`;
    
    const product = {
        id: id,
        ten: ten,
        gia: gia || gia_khuyen_mai || 100000,
        gia_khuyen_mai: gia_khuyen_mai || gia || 100000,
        badge: badge,
        category: category,
        brand: brandMatch ? brandMatch[1].trim() : 'MENXPORT',
        tags: tags,
        mo_ta_ngan: mo_ta_ngan,
        hinh_anh_chinh: hinh_anh_chinh,
        hinh_anh_phu: hinh_anh_phu.slice(0, 6),
        dac_diem: dac_diem.slice(0, 5),
        detail_page: detailPage
    };
    
    products.push(product);
});

// Ghi file JSON
const outputPath = path.join(__dirname, '../duLieuSP/san-pham.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');

console.log(`Đã tạo file JSON với ${products.length} sản phẩm`);
console.log(`File: ${outputPath}`);


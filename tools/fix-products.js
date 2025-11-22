const fs = require('fs');
const path = require('path');

// Đọc file JSON
const jsonPath = path.join(__dirname, '../duLieuSP/san-pham.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. Xóa sp19 (sản phẩm placeholder)
const filtered = products.filter(p => p.detail_page !== 'chitietsp/sp19.html');

// 2. Sửa ảnh sai
filtered.forEach(p => {
    // sp20: sửa ảnh từ sp23 folder sang sp20 folder
    if (p.detail_page === 'chitietsp/sp20.html') {
        if (p.hinh_anh_chinh && p.hinh_anh_chinh.includes('sp23.chì đeo tay')) {
            p.hinh_anh_chinh = '../taiNguyen/img/sanpham/sp20.tạ đeo tay kiểu mới bufalo/image.png';
        }
        if (p.hinh_anh_phu && Array.isArray(p.hinh_anh_phu)) {
            p.hinh_anh_phu = p.hinh_anh_phu.map(img => {
                if (img.includes('sp23.chì đeo tay')) {
                    return img.replace('sp23.chì đeo tay, võ chì tay chân', 'sp20.tạ đeo tay kiểu mới bufalo');
                }
                return img;
            });
        }
    }
    
    // sp22: sửa ảnh từ sp20 folder sang sp22 folder (nhưng sp22 thực ra là tạ đeo tay buffalo)
    // Kiểm tra lại: sp22 trong JSON là "Tạ đeo tay BUFFALO 2kg" nhưng detail_page là sp22.html
    // Có vẻ như sp22 và sp20 bị nhầm lẫn
    
    // sp23: sửa ảnh từ sp22 folder sang sp23 folder
    if (p.detail_page === 'chitietsp/sp23.html') {
        if (p.hinh_anh_chinh && p.hinh_anh_chinh.includes('sp22.chid đeo chân')) {
            p.hinh_anh_chinh = '../taiNguyen/img/sanpham/sp23.chì đeo tay, võ chì tay chân/image.png';
        }
        if (p.hinh_anh_phu && Array.isArray(p.hinh_anh_phu)) {
            p.hinh_anh_phu = p.hinh_anh_phu.map(img => {
                if (img.includes('sp22.chid đeo chân')) {
                    return img.replace('sp22.chid đeo chân', 'sp23.chì đeo tay, võ chì tay chân');
                }
                return img;
            });
        }
    }
});

// Ghi lại file
fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 2), 'utf8');
console.log(`Đã sửa file JSON: xóa ${products.length - filtered.length} sản phẩm, còn lại ${filtered.length} sản phẩm`);


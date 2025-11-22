const fs = require('fs');
const path = require('path');

// Mapping từ detail_page sang variant key
const variantKeyMap = {
    'chitietsp/sp1.html': 'bo-ta-8-canh-sp131',
    'chitietsp/sp2.html': 'xa-don-sp011',
    'chitietsp/sp3.html': null, // Kẹp bóp tay - không có variant
    'chitietsp/sp4.html': 'gay-bong-chay-sp023',
    'chitietsp/sp5.html': 'tui-deo-hong-sp041',
    'chitietsp/sp6.html': 'ta-deo-chan-tay-mat-sat',
    'chitietsp/sp7.html': 'bo-ta-sp124',
    'chitietsp/sp8.html': 'ta-loi-be-tong',
    'chitietsp/sp9.html': 'ta-am-den-sp104',
    'chitietsp/sp10.html': null, // Lều picnic - không có variant
    'chitietsp/sp11.html': 'bo-ta-12-canh-sp122',
    'chitietsp/sp12.html': 'xa-don-sp008',
    'chitietsp/sp13.html': 'xa-don-sp011',
    'chitietsp/sp14.html': 'gay-be-co-tay-sp095',
    'chitietsp/sp15.html': 'day-nhay-sp003',
    'chitietsp/sp16.html': 'day-khang-sp001',
    'chitietsp/sp17.html': null, // Dụng cụ tập bụng - không có variant
    'chitietsp/sp18.html': 'gay-bong-chay-sp023',
    'chitietsp/sp20.html': 'ta-deo-tay-buffalo',
    'chitietsp/sp21.html': 'ao-ta-mang-nguoi',
    'chitietsp/sp22.html': 'ta-deo-chan-buffalo',
    'chitietsp/sp23.html': 'chi-deo-tay'
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
    
    // Kiểm tra xem đã có variant-selector chưa
    if (content.includes('variant-selector')) {
        console.log(`✓ ${file} đã có variant-selector`);
        return;
    }
    
    // Tìm vị trí để chèn variant-selector (trước quantity-add-section)
    const quantitySectionMatch = content.match(/(<div class="quantity-add-section">)/);
    if (!quantitySectionMatch) {
        console.log(`⚠ ${file}: Không tìm thấy quantity-add-section`);
        return;
    }
    
    const detailPage = `chitietsp/${file}`;
    const variantKey = variantKeyMap[detailPage];
    
    // Tạo HTML cho variant selector
    let variantHtml = '';
    if (variantKey) {
        variantHtml = `\n                <div class="variant-selector" data-variant-key="${variantKey}"></div>\n`;
    } else {
        // Tạo variant selector mặc định (sẽ ẩn nếu chỉ có 1 variant)
        variantHtml = `\n                <div class="variant-selector" data-variant-key=""></div>\n`;
    }
    
    // Chèn vào trước quantity-add-section
    const newContent = content.replace(
        /(<div class="quantity-add-section">)/,
        variantHtml + '$1'
    );
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Đã thêm variant-selector vào ${file}${variantKey ? ` (key: ${variantKey})` : ' (mặc định)'}`);
});

console.log('\nHoàn thành!');


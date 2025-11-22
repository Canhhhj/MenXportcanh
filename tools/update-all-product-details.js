const fs = require('fs');
const path = require('path');

// Đọc dữ liệu sản phẩm
const jsonPath = path.join(__dirname, '../duLieuSP/san-pham.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Template cho description tab
function generateDescriptionTab(product) {
    const categoryMap = {
        'banh-ta': 'Bánh tạ & Plate',
        'ta-don': 'Tạ đơn & Thanh đòn',
        'phu-kien': 'Phụ kiện Boxing',
        'combo': 'Combo thể thao'
    };
    
    const category = categoryMap[product.category] || 'Thể thao';
    
    return `            <div class="tab-pane active" id="description-tab">
                <div class="description-content">
                    <div class="description-intro">
                        <h3><i class="fa-solid fa-star"></i> Giới thiệu sản phẩm</h3>
                        <p>${product.ten} là sản phẩm chuyên nghiệp thuộc danh mục ${category}, được thiết kế và sản xuất bởi ${product.brand || 'MENXPORT'}. ${product.mo_ta_ngan || 'Sản phẩm chất lượng cao, phù hợp cho việc luyện tập tại nhà hoặc phòng tập thể thao.'}</p>
                        <p>Được sản xuất bởi ${product.brand || 'MENXPORT'} - thương hiệu uy tín trong lĩnh vực dụng cụ thể thao, sản phẩm này là lựa chọn hoàn hảo cho những ai đam mê luyện tập thể thao và nâng cao sức khỏe.</p>
                    </div>
                    
                    <div class="description-features">
                        <h3><i class="fa-solid fa-check-circle"></i> Đặc điểm nổi bật</h3>
                        <div class="features-grid">
${product.dac_diem && product.dac_diem.length > 0 ? product.dac_diem.slice(0, 6).map((diem, idx) => {
    const icons = ['fa-shield-halved', 'fa-balance-scale', 'fa-paint-roller', 'fa-hand', 'fa-ruler', 'fa-weight-hanging'];
    const titles = ['Chất liệu cao cấp', 'Thiết kế tối ưu', 'Bền bỉ', 'Dễ sử dụng', 'Kích thước phù hợp', 'Trọng lượng tối ưu'];
    const cleanText = diem.replace(/<[^>]*>/g, '').replace(/^[^:]*:\s*/, '');
    return `                            <div class="feature-item">
                                <div class="feature-icon"><i class="fa-solid ${icons[idx % icons.length]}"></i></div>
                                <div class="feature-content">
                                    <h4>${titles[idx % titles.length]}</h4>
                                    <p>${cleanText || diem}</p>
                                </div>
                            </div>`;
}).join('\n') : `                            <div class="feature-item">
                                <div class="feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
                                <div class="feature-content">
                                    <h4>Chất liệu cao cấp</h4>
                                    <p>Được làm từ chất liệu cao cấp, đảm bảo độ bền và an toàn khi sử dụng.</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon"><i class="fa-solid fa-balance-scale"></i></div>
                                <div class="feature-content">
                                    <h4>Thiết kế tối ưu</h4>
                                    <p>Thiết kế hiện đại, phù hợp với nhu cầu luyện tập của người dùng.</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon"><i class="fa-solid fa-hand"></i></div>
                                <div class="feature-content">
                                    <h4>Dễ sử dụng</h4>
                                    <p>Sản phẩm dễ sử dụng, phù hợp cho cả người mới bắt đầu và người có kinh nghiệm.</p>
                                </div>
                            </div>`}
                        </div>
                    </div>

                    <div class="description-usage">
                        <h3><i class="fa-solid fa-dumbbell"></i> Ứng dụng</h3>
                        <div class="usage-list">
                            <div class="usage-item">
                                <i class="fa-solid fa-home"></i>
                                <div>
                                    <h4>Luyện tập tại nhà</h4>
                                    <p>Thiết kế gọn nhẹ, dễ dàng sử dụng tại nhà, tạo không gian tập luyện chuyên nghiệp.</p>
                                </div>
                            </div>
                            <div class="usage-item">
                                <i class="fa-solid fa-dumbbell"></i>
                                <div>
                                    <h4>Phòng tập thể thao</h4>
                                    <p>Phù hợp sử dụng tại các phòng tập thể thao, câu lạc bộ fitness chuyên nghiệp.</p>
                                </div>
                            </div>
                            <div class="usage-item">
                                <i class="fa-solid fa-heart"></i>
                                <div>
                                    <h4>Nâng cao sức khỏe</h4>
                                    <p>Hỗ trợ các bài tập nâng cao sức khỏe, tăng cường thể lực và sức bền.</p>
                                </div>
                            </div>
                            <div class="usage-item">
                                <i class="fa-solid fa-users"></i>
                                <div>
                                    <h4>Phù hợp mọi đối tượng</h4>
                                    <p>Sản phẩm phù hợp cho mọi đối tượng, từ người mới bắt đầu đến vận động viên chuyên nghiệp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

// Template cho specs tab
function generateSpecsTab(product) {
    const specs = [
        { icon: 'fa-ruler-combined', label: 'Kích thước', value: 'Theo tiêu chuẩn' },
        { icon: 'fa-cube', label: 'Chất liệu', value: 'Cao cấp, bền bỉ' },
        { icon: 'fa-weight', label: 'Trọng lượng', value: 'Nhẹ, dễ sử dụng' },
        { icon: 'fa-palette', label: 'Màu sắc', value: 'Tone MENXPORT' },
        { icon: 'fa-shield', label: 'Bảo hành', value: '24 tháng' },
        { icon: 'fa-tag', label: 'Thương hiệu', value: product.brand || 'MENXPORT' },
        { icon: 'fa-box', label: 'Xuất xứ', value: 'Việt Nam' },
        { icon: 'fa-certificate', label: 'Chứng nhận', value: 'ISO 9001:2015' },
        { icon: 'fa-truck', label: 'Vận chuyển', value: 'Miễn phí từ 2.000.000₫' }
    ];
    
    return `            <div class="tab-pane" id="specs-tab" style="display:none;">
                <div class="specs-content">
                    <h3><i class="fa-solid fa-clipboard-list"></i> Thông số kỹ thuật chi tiết</h3>
                    <div class="specs-grid">
${specs.map(spec => `                        <div class="spec-item">
                            <div class="spec-label">
                                <i class="fa-solid ${spec.icon}"></i>
                                <span>${spec.label}</span>
                            </div>
                            <div class="spec-value">${spec.value}</div>
                        </div>`).join('\n')}
                    </div>
                </div>
            </div>`;
}

// Template cho policy tab
function generatePolicyTab(product) {
    const needsInstallation = product.dac_diem && product.dac_diem.some(d => 
        typeof d === 'string' && d.includes('Lắp đặt') && !d.includes('Không cần')
    );
    
    return `            <div class="tab-pane" id="policy-tab" style="display:none;">
                <div class="policy-content">
                    <h3><i class="fa-solid fa-file-contract"></i> Chính sách & Dịch vụ</h3>
                    <div class="policy-grid">
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-truck-fast"></i></div>
                            <div class="policy-info">
                                <h4>Miễn phí vận chuyển</h4>
                                <p>Đơn hàng từ 2.000.000₫ được miễn phí vận chuyển toàn quốc. Giao hàng nhanh 2H tại Hà Nội & TP.HCM.</p>
                            </div>
                        </div>
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-tools"></i></div>
                            <div class="policy-info">
                                <h4>${needsInstallation ? 'Lắp đặt miễn phí' : 'Không cần lắp đặt'}</h4>
                                <p>${needsInstallation ? 'Miễn phí lắp đặt tận nơi trong vòng 24h tại Hà Nội. Đội ngũ kỹ thuật chuyên nghiệp.' : 'Không cần lắp đặt, sử dụng ngay sau khi nhận hàng. Sản phẩm đã được kiểm tra chất lượng kỹ lưỡng.'}</p>
                            </div>
                        </div>
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-shield-halved"></i></div>
                            <div class="policy-info">
                                <h4>Bảo hành chính hãng</h4>
                                <p>Bảo hành chính hãng 24 tháng. Hỗ trợ đổi mới trong 30 ngày đầu nếu phát hiện lỗi từ nhà sản xuất.</p>
                            </div>
                        </div>
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-rotate-left"></i></div>
                            <div class="policy-info">
                                <h4>Đổi trả miễn phí</h4>
                                <p>Đổi trả miễn phí trong 30 ngày nếu sản phẩm có lỗi. Hoàn tiền 100% nếu không hài lòng.</p>
                            </div>
                        </div>
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-gift"></i></div>
                            <div class="policy-info">
                                <h4>Quà tặng đặc biệt</h4>
                                <p>Tặng kèm phụ kiện cao cấp khi mua trong tuần này. Áp dụng cho 50 khách hàng đầu tiên.</p>
                            </div>
                        </div>
                        <div class="policy-card">
                            <div class="policy-icon"><i class="fa-solid fa-headset"></i></div>
                            <div class="policy-info">
                                <h4>Hỗ trợ 24/7</h4>
                                <p>Đội ngũ chăm sóc khách hàng hỗ trợ 24/7. Hotline: 0878 153 630 hoặc email: menxportvietnam@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

// Xử lý từng file
const spDir = path.join(__dirname, '../giaoDien/chitietsp');
const files = fs.readdirSync(spDir).filter(f => f.match(/^sp\d+\.html$/)).sort((a, b) => {
    const numA = parseInt(a.match(/sp(\d+)/)[1]);
    const numB = parseInt(b.match(/sp(\d+)/)[1]);
    return numA - numB;
});

let updated = 0;
let skipped = 0;

files.forEach(file => {
    const filePath = path.join(spDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Tìm sản phẩm tương ứng
    const spNum = parseInt(file.match(/sp(\d+)/)[1]);
    const product = products.find(p => {
        const pageNum = p.detail_page ? parseInt(p.detail_page.match(/sp(\d+)/)?.[1]) : null;
        return pageNum === spNum;
    });
    
    if (!product) {
        console.log(`⚠ ${file}: Không tìm thấy dữ liệu sản phẩm`);
        skipped++;
        return;
    }
    
    // Kiểm tra xem đã có description-content chưa
    if (content.includes('description-content')) {
        console.log(`✓ ${file}: Đã có nội dung chi tiết`);
        skipped++;
        return;
    }
    
    // Tìm vị trí bắt đầu và kết thúc của description tab
    const descStart = content.indexOf('<div class="tab-pane active" id="description-tab"');
    if (descStart === -1) {
        console.log(`⚠ ${file}: Không tìm thấy description tab`);
        return;
    }
    
    // Tìm vị trí kết thúc của description tab (trước tab tiếp theo hoặc </section>)
    let descEnd = content.indexOf('</div>', descStart);
    let depth = 1;
    let pos = descStart;
    while (depth > 0 && pos < content.length) {
        pos = content.indexOf('</div>', pos + 1);
        if (pos === -1) break;
        depth--;
        if (content.substring(pos - 10, pos).includes('<div')) depth++;
        if (depth === 0) {
            descEnd = pos + 6;
            break;
        }
    }
    
    // Tìm vị trí specs tab
    const specsStart = content.indexOf('<div class="tab-pane"', descEnd);
    if (specsStart === -1 || !content.substring(specsStart, specsStart + 50).includes('specs-tab')) {
        console.log(`⚠ ${file}: Không tìm thấy specs tab`);
        return;
    }
    
    let specsEnd = content.indexOf('</div>', specsStart);
    depth = 1;
    pos = specsStart;
    while (depth > 0 && pos < content.length) {
        pos = content.indexOf('</div>', pos + 1);
        if (pos === -1) break;
        depth--;
        if (content.substring(pos - 10, pos).includes('<div')) depth++;
        if (depth === 0) {
            specsEnd = pos + 6;
            break;
        }
    }
    
    // Tìm vị trí policy tab
    const policyStart = content.indexOf('<div class="tab-pane"', specsEnd);
    if (policyStart === -1 || !content.substring(policyStart, policyStart + 50).includes('policy-tab')) {
        console.log(`⚠ ${file}: Không tìm thấy policy tab`);
        return;
    }
    
    let policyEnd = content.indexOf('</div>', policyStart);
    depth = 1;
    pos = policyStart;
    while (depth > 0 && pos < content.length) {
        pos = content.indexOf('</div>', pos + 1);
        if (pos === -1) break;
        depth--;
        if (content.substring(pos - 10, pos).includes('<div')) depth++;
        if (depth === 0) {
            policyEnd = pos + 6;
            break;
        }
    }
    
    // Thay thế từng phần
    const newDescriptionTab = generateDescriptionTab(product);
    const newSpecsTab = generateSpecsTab(product);
    const newPolicyTab = generatePolicyTab(product);
    
    let newContent = content.substring(0, descStart) + 
                     newDescriptionTab + 
                     content.substring(descEnd, specsStart) +
                     newSpecsTab +
                     content.substring(specsEnd, policyStart) +
                     newPolicyTab +
                     content.substring(policyEnd);
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Đã cập nhật ${file} - ${product.ten}`);
    updated++;
});

console.log(`\nHoàn thành! Đã cập nhật ${updated} file, bỏ qua ${skipped} file.`);


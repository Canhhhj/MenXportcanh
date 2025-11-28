// Code Google Apps Script - Copy toàn bộ code này vào Apps Script editor
// File: GOOGLE_APPS_SCRIPT_CODE.js

function doPost(e) {
  try {
    // Lấy Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse dữ liệu JSON từ request
    let data = {};
    
    // Thử parse từ postData.contents (khi gửi với Content-Type: text/plain)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        // Nếu không parse được, thử lấy từ parameter
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      // Nếu có parameter (form data)
      data = e.parameter;
    }
    
    // Lấy dữ liệu từ request (hỗ trợ cả tiếng Anh và tiếng Việt)
    const maDon = data.orderCode || data.MaDon || '';
    const ten = data.name || data.Ten || '';
    const sdt = data.phone || data.SDT || '';
    const email = data.email || data.Email || '';
    const diaChi = data.address || data.DiaChi || '';
    const sanPham = data.products || data.SanPham || '';
    const hinhThuc = data.payment || data.HinhThucThanhToan || '';
    const ngayDat = data.orderDate || data.NgayDat || new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Thêm dòng mới vào Sheet
    sheet.appendRow([
      maDon,
      ten,
      sdt,
      email,
      diaChi,
      sanPham,
      hinhThuc,
      ngayDat
    ]);
    
    // Trả về response thành công
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Đã lưu đơn hàng'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log lỗi để debug (xem trong Executions)
    console.error('Lỗi doPost:', error.toString());
    console.error('Request data:', JSON.stringify(e));
    
    // Trả về lỗi
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Google Sheet Webhook đang hoạt động!')
    .setMimeType(ContentService.MimeType.TEXT);
}








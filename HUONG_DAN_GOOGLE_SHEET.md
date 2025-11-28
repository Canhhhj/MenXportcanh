# Hướng dẫn thiết lập Google Sheet để nhận đơn hàng

## Bước 1: Tạo Google Sheet mới

1. Mở Google Drive: https://drive.google.com
2. Tạo Google Sheet mới (File > New > Google Sheets)
3. Đặt tên Sheet (ví dụ: "Đơn hàng Menxport")

## Bước 2: Tạo tiêu đề cột (dòng 1)

Trong dòng đầu tiên (Row 1), nhập các cột sau:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **Mã đơn** | **Tên** | **SĐT** | **Email** | **Địa chỉ** | **Sản phẩm** | **Hình thức thanh toán** | **Ngày đặt** |

**Lưu ý:** Tên cột phải CHÍNH XÁC như trên (có dấu, viết hoa đúng chỗ)

## Bước 3: Tạo Google Apps Script

1. Trong Google Sheet, click **Extensions** > **Apps Script**
2. Xóa toàn bộ code mặc định
3. Dán code sau vào:

```javascript
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
```

4. Click **Save** (💾) và đặt tên project (ví dụ: "Menxport Order Webhook")

## Bước 4: Deploy Apps Script

1. Click **Deploy** > **New deployment**
2. Click biểu tượng ⚙️ (Settings) bên cạnh "Select type"
3. Chọn **Web app**
4. Điền thông tin:
   - **Description:** "Webhook nhận đơn hàng Menxport"
   - **Execute as:** Chọn tài khoản của bạn
   - **Who has access:** Chọn **Anyone** (quan trọng!)
5. Click **Deploy**
6. **QUAN TRỌNG:** Copy **Web app URL** (sẽ có dạng: `https://script.google.com/macros/s/.../exec`)
7. Click **Done**

## Bước 5: Cấp quyền cho Apps Script

1. Khi deploy lần đầu, Google sẽ yêu cầu cấp quyền
2. Click **Review Permissions**
3. Chọn tài khoản Google của bạn
4. Click **Advanced** > **Go to [Project Name] (unsafe)**
5. Click **Allow** để cấp quyền truy cập Google Sheet

## Bước 6: Cập nhật URL vào code frontend

1. Copy **Web app URL** từ Bước 4
2. Mở file `JS/xu-ly-thanh-toan.js`
3. Tìm dòng: `const GOOGLE_SHEET_WEBHOOK = '...'`
4. Thay URL cũ bằng URL mới của bạn

## Bước 7: Test thử

1. Mở trang thanh toán trên website
2. Điền thông tin và đặt hàng
3. Kiểm tra Google Sheet - sẽ có dòng mới xuất hiện!

## Xử lý lỗi

### Không thấy dữ liệu trong Sheet:

1. **Kiểm tra Apps Script có nhận được request:**
   - Mở Apps Script editor
   - Click **Executions** (bên trái)
   - Xem có execution nào mới không
   - Click vào execution để xem log và lỗi (nếu có)

2. **Kiểm tra quyền truy cập:**
   - Đảm bảo "Who has access" đã chọn **Anyone**
   - Nếu chưa, click **Deploy** > **Manage deployments** > Click biểu tượng bút chì (Edit) > Đổi "Who has access" thành **Anyone** > **Deploy**

3. **Kiểm tra tên cột:**
   - Đảm bảo dòng 1 có đúng: **Mã đơn**, **Tên**, **SĐT**, **Email**, **Địa chỉ**, **Sản phẩm**, **Hình thức thanh toán**, **Ngày đặt**

4. **Test thử Apps Script:**
   - Mở URL webhook trong trình duyệt (ví dụ: `https://script.google.com/macros/s/YOUR_ID/exec`)
   - Nếu thấy "Google Sheet Webhook đang hoạt động!" thì Apps Script đã hoạt động
   - Nếu thấy lỗi, kiểm tra lại deployment

5. **Kiểm tra console trên website:**
   - Mở trang thanh toán
   - Nhấn F12 để mở Developer Tools
   - Vào tab **Console**
   - Đặt hàng và xem có log "Đã gửi dữ liệu lên Google Sheet:" không
   - Nếu có lỗi, sẽ hiển thị trong console

### Lỗi "Access denied":
- Đảm bảo "Who has access" đã chọn **Anyone**
- Redeploy lại Apps Script

### Lỗi CORS:
- Code đã được cấu hình với `mode: 'no-cors'` nên không cần lo lắng

## Bước 8: Kiểm tra lại Apps Script (QUAN TRỌNG)

Sau khi deploy, bạn **PHẢI** làm lại các bước sau nếu vẫn không thấy dữ liệu:

1. **Copy lại code Apps Script mới** (code đã được cập nhật ở trên)
2. **Save** lại Apps Script
3. **Deploy lại:**
   - Click **Deploy** > **Manage deployments**
   - Click biểu tượng bút chì (Edit) ở deployment hiện tại
   - Click **Deploy** (không cần thay đổi gì)
   - Copy lại **Web app URL** mới (nếu có)
   - Cập nhật URL mới vào `JS/xu-ly-thanh-toan.js` nếu URL thay đổi

4. **Test lại:**
   - Đặt một đơn hàng thử
   - Kiểm tra Google Sheet
   - Kiểm tra **Executions** trong Apps Script để xem có lỗi không


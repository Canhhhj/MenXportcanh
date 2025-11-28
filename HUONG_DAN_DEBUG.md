# Hướng dẫn Debug Google Sheet Webhook

## Bước 1: Kiểm tra Google Sheet có dữ liệu không

1. Mở Google Sheet "Đơn hàng Menxport"
2. Kiểm tra xem có dòng mới với dữ liệu test không
3. Nếu **CÓ** → ✅ Webhook hoạt động tốt!
4. Nếu **KHÔNG** → Tiếp tục bước 2

## Bước 2: Kiểm tra Apps Script Executions

### Cách kiểm tra:
1. Mở Google Sheet
2. Click **Extensions** > **Apps Script**
3. Ở menu bên trái, click **Executions** (biểu tượng đồng hồ)
4. Xem danh sách executions

### Các trường hợp:

#### Trường hợp A: Có execution mới
- Click vào execution mới nhất
- Xem **Status**:
  - ✅ **Success** → Script chạy thành công, nhưng có thể có lỗi logic
  - ❌ **Failed** → Có lỗi, click để xem chi tiết

#### Trường hợp B: Không có execution nào
- Có nghĩa là Apps Script không nhận được request
- **Nguyên nhân có thể:**
  1. URL webhook sai
  2. Apps Script chưa được deploy
  3. Quyền truy cập chưa đúng

## Bước 3: Kiểm tra Deployment

1. Trong Apps Script editor, click **Deploy** > **Manage deployments**
2. Xem có deployment nào không
3. Click vào deployment để xem:
   - **Web app URL** có đúng không
   - **Who has access** phải là **Anyone**
   - **Execute as** phải là tài khoản của bạn

### Nếu "Who has access" không phải "Anyone":
1. Click biểu tượng **Edit** (bút chì)
2. Đổi "Who has access" thành **Anyone**
3. Click **Deploy**
4. Copy lại **Web app URL** mới (nếu có)
5. Cập nhật URL mới vào `JS/xu-ly-thanh-toan.js`

## Bước 4: Kiểm tra Code Apps Script

1. Trong Apps Script editor, kiểm tra code có giống file `GOOGLE_APPS_SCRIPT_CODE.js` không
2. Nếu khác, copy lại code từ file đó
3. Click **Save**
4. **Deploy lại** (Bước 3)

## Bước 5: Kiểm tra Tên Cột trong Google Sheet

Đảm bảo dòng 1 có đúng các cột:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 |
|---|---|---|---|---|---|---|---|
| **Mã đơn** | **Tên** | **SĐT** | **Email** | **Địa chỉ** | **Sản phẩm** | **Hình thức thanh toán** | **Ngày đặt** |

**Lưu ý:** Tên cột phải CHÍNH XÁC (có dấu, viết hoa đúng chỗ)

## Bước 6: Test lại

1. Mở file `test-webhook.html` trong trình duyệt
2. Click **Test Webhook**
3. Đợi vài giây
4. Kiểm tra lại Google Sheet
5. Kiểm tra lại Apps Script Executions

## Các lỗi thường gặp

### Lỗi 1: "TypeError: Cannot read property 'postData' of undefined"
**Nguyên nhân:** Apps Script không nhận được dữ liệu đúng cách
**Giải pháp:** Đảm bảo code Apps Script đúng (xem file `GOOGLE_APPS_SCRIPT_CODE.js`)

### Lỗi 2: "Exception: The number of columns in the data does not match the number of columns in the range"
**Nguyên nhân:** Số cột dữ liệu không khớp với số cột trong Sheet
**Giải pháp:** Kiểm tra lại code `sheet.appendRow()` có đúng 8 giá trị không

### Lỗi 3: Không có execution nào
**Nguyên nhân:** Request không đến được Apps Script
**Giải pháp:**
- Kiểm tra URL webhook có đúng không
- Kiểm tra deployment có "Who has access" = "Anyone" không
- Redeploy lại Apps Script

### Lỗi 4: Execution thành công nhưng không có dữ liệu trong Sheet
**Nguyên nhân:** Có thể do:
- Tên Sheet không đúng
- Code có lỗi logic nhưng không throw error
**Giải pháp:**
- Kiểm tra code Apps Script có đúng không
- Thêm logging để debug (xem bước 7)

## Bước 7: Thêm Logging để Debug

Nếu vẫn không thấy dữ liệu, thêm logging vào Apps Script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // LOG: Ghi lại request
    console.log('Received request:', JSON.stringify(e));
    
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Parsed data:', JSON.stringify(data));
      } catch (parseError) {
        console.error('Parse error:', parseError);
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
      console.log('Using parameter data:', JSON.stringify(data));
    }
    
    // ... phần còn lại của code ...
    
    // LOG: Ghi lại dữ liệu sẽ thêm vào Sheet
    const rowData = [maDon, ten, sdt, email, diaChi, sanPham, hinhThuc, ngayDat];
    console.log('Row data to append:', JSON.stringify(rowData));
    
    sheet.appendRow(rowData);
    console.log('Row appended successfully');
    
    // ... phần còn lại ...
  } catch (error) {
    console.error('Error in doPost:', error.toString());
    console.error('Stack:', error.stack);
    throw error;
  }
}
```

Sau đó:
1. **Save** code
2. **Deploy lại** Apps Script
3. Test lại
4. Xem log trong **Executions** để biết chính xác lỗi ở đâu

## Liên hệ hỗ trợ

Nếu vẫn không giải quyết được, cung cấp:
1. Screenshot của Apps Script Executions (có lỗi nếu có)
2. Screenshot của Google Sheet (để xem tên cột)
3. Code Apps Script hiện tại (copy/paste)








# 🔧 Sửa lỗi Deployment - "Who has access?"

## ❌ Vấn đề hiện tại:
- **"Who has access?"** đang là **"Just me"**
- Điều này khiến website không thể gửi dữ liệu đến Apps Script
- Chỉ có bạn mới có quyền truy cập, website không có quyền

## ✅ Cách sửa:

### Bước 1: Mở Manage Deployments
1. Mở Google Sheet
2. Click **Extensions** > **Apps Script**
3. Click **Deploy** > **Manage deployments**

### Bước 2: Edit Deployment
1. Tìm deployment có tên "Đơn hàng MenXport"
2. Click biểu tượng **Edit** (bút chì) ở bên phải deployment

### Bước 3: Thay đổi "Who has access"
1. Tìm phần **"Who has access?"**
2. Click dropdown và chọn **"Anyone"** (không phải "Just me")
3. Google sẽ hiển thị cảnh báo - click **Deploy** để xác nhận

### Bước 4: Deploy lại
1. Click nút **Deploy** (màu xanh)
2. **QUAN TRỌNG:** Copy lại **Web app URL** mới (nếu có URL mới)
3. Nếu URL thay đổi, cập nhật vào file `JS/xu-ly-thanh-toan.js`

### Bước 5: Xác nhận
Sau khi deploy, bạn sẽ thấy:
- **"Who has access?"** = **"Anyone"** ✅
- **Web app URL** vẫn giữ nguyên hoặc có URL mới

### Bước 6: Test lại
1. Mở file `test-webhook.html` trong trình duyệt
2. Click **Test Webhook**
3. Kiểm tra Google Sheet - dữ liệu sẽ xuất hiện!

## ⚠️ Lưu ý:
- Khi chọn "Anyone", Google sẽ cảnh báo về bảo mật
- Đây là bình thường và cần thiết để website có thể gửi dữ liệu
- Apps Script vẫn chỉ chạy với quyền của bạn (Execute as: Me)
- Chỉ có thể gửi dữ liệu vào Sheet, không thể đọc hoặc xóa

## 🎯 Kết quả mong đợi:
Sau khi sửa, deployment sẽ hiển thị:
```
Who has access?
Anyone
```

Và webhook sẽ hoạt động bình thường!








const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/nguoi-dung.json');
    let nguoiDung = [];
    try {
        nguoiDung = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        nguoiDung = [];
    }
    res.json(nguoiDung);
});

router.post('/dang-ky', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/nguoi-dung.json');
    const nguoiDungMoi = req.body;
    nguoiDungMoi.ngayTao = new Date().toISOString();
    let nguoiDung = [];
    try {
        nguoiDung = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        nguoiDung = [];
    }
    // Kiểm tra email đã tồn tại chưa
    if (nguoiDung.find(u => u.email === nguoiDungMoi.email)) {
        return res.status(400).json({status:'fail', message:'Email đã được sử dụng'});
    }
    nguoiDung.push(nguoiDungMoi);
    fs.writeFileSync(filePath, JSON.stringify(nguoiDung, null, 2), 'utf8');
    res.json({status:'success', message:'Đăng ký thành công!'});
});

router.post('/dang-nhap', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/nguoi-dung.json');
    const {email, matKhau} = req.body;
    let nguoiDung = [];
    try {
        nguoiDung = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        nguoiDung = [];
    }
    const user = nguoiDung.find(u=>u.email===email && u.matKhau===matKhau);
    if(user) {
        // Không trả về mật khẩu
        const {matKhau, ...userInfo} = user;
        res.json({status:'success', message:'Đăng nhập thành công!', user: userInfo});
    } else {
        res.status(401).json({status:'fail', message:'Email hoặc mật khẩu không đúng'});
    }
});

module.exports = router;

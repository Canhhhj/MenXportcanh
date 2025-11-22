const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/don-hang.json');
    const donHang = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(donHang);
});

router.post('/', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/don-hang.json');
    const donHangMoi = req.body;
    donHangMoi.ngayTao = new Date().toISOString();
    let donHang = [];
    try {
        donHang = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        donHang = [];
    }
    donHang.push(donHangMoi);
    fs.writeFileSync(filePath, JSON.stringify(donHang, null, 2), 'utf8');
    res.json({status:'success', message:'Đặt hàng thành công!', order: donHangMoi});
});

module.exports = router;

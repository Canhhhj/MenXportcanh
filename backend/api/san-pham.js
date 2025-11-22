const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/san-pham.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
});

router.get('/:id', (req,res)=>{
    const path = require('path');
    const filePath = path.join(__dirname, '../data/san-pham.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const sp = data.find(p=>p.id===req.params.id);
    if(sp) res.json(sp);
    else res.status(404).json({message:'Không tìm thấy sản phẩm'});
});

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sanPhamRoutes = require('./api/san-pham');
const donHangRoutes = require('./api/don-hang');
const nguoiDungRoutes = require('./api/nguoi-dung');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/san-pham', sanPhamRoutes);
app.use('/don-hang', donHangRoutes);
app.use('/nguoi-dung', nguoiDungRoutes);

app.listen(PORT, ()=>console.log(`Server chạy tại http://localhost:${PORT}`));

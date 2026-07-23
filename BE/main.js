const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 🟢 Import hàm taoQRThanhToan
const { taoQRThanhToan } = require('./src/ultis/qrcode'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const authRoutes = require('./src/routes/auth.routes'); 
const productsRoutes = require('./src/routes/products.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const brandsRoutes = require('./src/routes/brands.routes');
const ordersRoutes = require('./src/routes/orders.routes');
const cartRoutes = require('./src/routes/cart.routes');
const couponsRoutes = require('./src/routes/coupons.routes');
const paymentsRoutes = require('./src/routes/payments.routes'); 
// 🟢 Import route reviews
const reviewsRoutes = require('./src/routes/reviews.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/payments', paymentsRoutes);
// 🟢 Khai báo endpoint /api/reviews
app.use('/api/reviews', reviewsRoutes);

// 🟢 THÊM API TẠO MÃ QR TẠI ĐÂY
app.post('/api/qr', async (req, res) => {
  try {
    const qrData = await taoQRThanhToan(req.body);
    res.json({ success: true, qr: qrData });
  } catch (error) {
    console.error('Lỗi API QR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
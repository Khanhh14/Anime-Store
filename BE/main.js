const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
// 🟢 THAY ĐỔI Ở ĐÂY: Import file ROUTE thay vì Controller
const authRoutes = require('./src/routes/auth.routes'); 
const productsRoutes = require('./src/routes/products.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const brandsRoutes = require('./src/routes/brands.routes');
const ordersRoutes = require('./src/routes/orders.routes');
const cartRoutes = require('./src/routes/cart.routes');
const couponsRoutes = require('./src/routes/coupons.routes');


// 🟢 THAY ĐỔI Ở ĐÂY: Sử dụng app.use cho gọn gàng và đồng bộ cấu trúc
// Tất cả các route trong authRoutes giờ sẽ tự động có tiền tố /api/auth
app.use('/api/auth', authRoutes);

// Products routes
app.use('/api/products', productsRoutes);

// Categories routes
app.use('/api/categories', categoriesRoutes);

// Brands routes
app.use('/api/brands', brandsRoutes);

// Orders routes
app.use('/api/orders', ordersRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Coupons routes
app.use('/api/coupons', couponsRoutes);

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
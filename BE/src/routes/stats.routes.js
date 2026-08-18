// BE/src/routes/stats.routes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controllers');

// Đường dẫn: GET /api/stats/overview (Thống kê tổng quan)
router.get('/overview', statsController.getStatsOverview);

// Đường dẫn: GET /api/stats/wishlist (Thống kê top sản phẩm được yêu thích)
router.get('/wishlist', statsController.getTopWishlistProducts);

module.exports = router;
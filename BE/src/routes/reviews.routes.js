const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews.controllers'); 
const authController = require('../controllers/auth.controllers');

// =========================================================================
// 1. CÁC ROUTE CÔNG KHAI (PUBLIC) - Không cần token đăng nhập
// =========================================================================

// Lấy danh sách tất cả đánh giá
router.get('/', reviewController.getAllReviews);

// ROUTE TĨNH PHẢI ĐẶT TRÊN ROUTE CÓ PARAMETERS (/:id)
router.get('/top-five-stars', reviewController.getTopFiveStarReviews);

// Lấy đánh giá theo Product ID
router.get('/product/:productId', reviewController.getReviewsByProductId);

// ROUTE CÓ PARAMETER (/:id) PHẢI ĐỂ PHÍA DƯỚI CÁC ROUTE TĨNH
router.get('/:id', reviewController.getReviewById);


// =========================================================================
// 2. CÁC ROUTE RIÊNG TƯ (PRIVATE) - Yêu cầu Token xác thực
// =========================================================================
router.use(authController.verifyToken);

router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
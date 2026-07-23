const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews.controllers'); 
const authController = require('../controllers/auth.controllers');

// Các route công khai (Public) - Không bắt buộc token để xem đánh giá
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/product/:productId', reviewController.getReviewsByProductId);

// Áp dụng middleware xác thực token cho các thao tác tạo/sửa/xóa phía dưới
router.use(authController.verifyToken);

// Các route riêng tư (Private) - Yêu cầu đăng nhập
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
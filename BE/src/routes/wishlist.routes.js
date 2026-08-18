const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlist.controllers');
const { protect } = require('../middleware/auth.middleware'); 

// 1. Lấy danh sách sản phẩm yêu thích của user
router.get('/', protect, wishlistController.getWishlist);

// 2. Thêm sản phẩm vào danh sách yêu thích
router.post('/', protect, wishlistController.addToWishlist);

// 3. Bật/Tắt yêu thích (Toggle)
router.post('/toggle', protect, wishlistController.toggleWishlist);

// 4. Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/:productId', protect, wishlistController.removeFromWishlist);


module.exports = router;
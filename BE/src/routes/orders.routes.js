const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controllers');
const authController = require('../controllers/auth.controllers');

// Áp dụng middleware xác thực token cho tất cả các route bên dưới
router.use(authController.verifyToken);

// Các route chính
router.get('/admin', ordersController.getAdminOrders);
router.get('/', ordersController.getUserOrders);
router.get('/:orderId', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:orderId', ordersController.updateOrderStatus);

// Route ghi nhận thanh toán từ PaymentModal (Không cần truyền authMiddleware lẻ vào nữa)
router.post('/payments', ordersController.recordPayment);

module.exports = router;
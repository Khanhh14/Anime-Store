const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controllers');
const authController = require('../controllers/auth.controllers');


router.use(authController.verifyToken);
router.get('/admin', ordersController.getAdminOrders);
router.get('/', ordersController.getUserOrders);
router.get('/:orderId', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:orderId', ordersController.updateOrderStatus);

module.exports = router;
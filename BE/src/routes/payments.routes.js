const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controllers'); 


router.get('/', paymentController.getAllPayments);
router.get('/order/:orderId', paymentController.getPaymentByOrderId);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePaymentStatus);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
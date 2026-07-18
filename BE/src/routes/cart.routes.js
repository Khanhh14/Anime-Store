const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');
const { protect } = require('../middleware/auth.middleware'); 

router.route('/')
  .get(protect, cartController.getUserCart)
  .post(protect, cartController.addToCart);

router.route('/:productId')
  .delete(protect, cartController.removeFromCart);

module.exports = router;
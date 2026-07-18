const express = require('express');
const router = express.Router();
const couponsController = require('../controllers/coupons.controllers');


router.get('/', couponsController.getAllCoupons);               
router.post('/', couponsController.createCoupon);             
router.put('/:id', couponsController.updateCoupon);           
router.delete('/:id', couponsController.deleteCoupon);        

module.exports = router;
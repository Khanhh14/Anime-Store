const express = require('express');
const router = express.Router();


const brandsController = require('../controllers/brands.controllers'); 

// Các route công khai công cộng
router.get('/', brandsController.getAllBrands);
router.get('/:id', brandsController.getBrandById);

// 2. TẠM THỜI XÓA CHỮ `protect` ĐI ĐỂ KHÔNG BỊ LỖI THIẾU FILE MIDDLEWARE
router.post('/', brandsController.createBrand);
router.put('/:id', brandsController.updateBrand);
router.delete('/:id', brandsController.deleteBrand);

module.exports = router;
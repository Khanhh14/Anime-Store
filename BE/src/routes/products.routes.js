const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controllers');
const { verifyToken } = require('../controllers/auth.controllers'); 
const multer = require('multer');
const path = require('path');

// Middleware chốt chặn: Kiểm tra xem user có phải admin không dựa trên token đã decode
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Hành động bị từ chối! Bạn không có quyền quản trị.'
    });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // BỔ SUNG: Giới hạn file ảnh tối đa 5MB cho an toàn
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload các định dạng ảnh (jpg, jpeg, png, gif, webp)!'));
    }
  },
});

// Hàm bọc (Wrapper) để bắt lỗi Multer tự động khi upload sai định dạng hoặc quá dung lượng
const uploadSingleImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};


router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.get('/category/:categoryId', productsController.getProductsByCategory);



router.post('/', uploadSingleImage, verifyToken, isAdmin, productsController.createProduct);
router.put('/:id', uploadSingleImage, verifyToken, isAdmin, productsController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productsController.deleteProduct);

module.exports = router;
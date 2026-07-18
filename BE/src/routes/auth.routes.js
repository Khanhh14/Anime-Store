const express = require('express');
const router = express.Router();
// Import file controller chứa toàn bộ code bạn vừa gửi ở trên
const authController = require('../controllers/auth.controllers'); // Cập nhật lại đường dẫn file cho đúng thực tế

// Các route có sẵn của bạn
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.verifyToken, authController.getCurrentUser);
router.post('/logout', authController.logout);
router.post('/change-password', authController.verifyToken, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/google', authController.googleLogin);

module.exports = router;
const express = require('express');
const router = express.Router();
// Import file controller chứa toàn bộ code auth và CRUD admin
const authController = require('../controllers/auth.controllers'); // Cập nhật lại đường dẫn file cho đúng thực tế

// 🛡️ Middleware kiểm tra quyền hạn Admin (Xác thực xem role có phải là admin không)
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Hợp lệ, cho phép đi tiếp vào controller
  } else {
    return res.status(403).json({
      success: false,
      message: 'Quyền truy cập bị từ chối! Bạn không phải quản trị viên hệ thống.'
    });
  }
};

// =========================================================================
// CÁC ROUTE XÁC THỰC CÓ SẴN CỦA BẠN
// =========================================================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.verifyToken, authController.getCurrentUser);
router.post('/logout', authController.logout);
router.post('/change-password', authController.verifyToken, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/google', authController.googleLogin);

// =========================================================================
// CÁC ROUTE QUẢN LÝ USER DÀNH RIÊNG CHO ADMIN (KẾT NỐI VỚI FRONTEND)
// Giao diện Frontend gọi qua endpoint: /api/users
// =========================================================================

// 1. Lấy danh sách toàn bộ người dùng hệ thống
router.get('/users', authController.verifyToken, checkAdminRole, authController.getAllUsers);

// 2. Admin tạo mới tài khoản thành viên trực tiếp
router.post('/users', authController.verifyToken, checkAdminRole, authController.adminCreateUser);

// 3. Admin cập nhật thông tin thành viên (Sửa họ tên, thay đổi role, đổi mật khẩu)
router.put('/users/:id', authController.verifyToken, checkAdminRole, authController.adminUpdateUser);

// 4. Admin xóa tài khoản thành viên khỏi hệ thống
router.delete('/users/:id', authController.verifyToken, checkAdminRole, authController.adminDeleteUser);

module.exports = router;
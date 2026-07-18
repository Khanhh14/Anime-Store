const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem Token có được gửi kèm trong Header không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Tách chuỗi lấy phần Token (bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 2. Xác thực Token bằng mã bí mật JWT_SECRET từ file .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('--- Auth Middleware Debug ---');
      console.log('Dữ liệu bên trong Token (Decoded):', decoded);

      const currentUserId = decoded.id || decoded.userId;

      if (!currentUserId) {
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ.'
        });
      }

      // 3. ĐÃ CẬP NHẬT CHUẨN CSDL: Lấy id, full_name, email, role từ bảng users
      const [users] = await db.query(
        'SELECT id, full_name, email, role FROM users WHERE id = ?', 
        [currentUserId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản liên kết với token này không còn tồn tại.'
        });
      }

      // 4. Gán thông tin user vào đối tượng `req` để controller tiếp theo sử dụng
      req.user = users[0];
      
      // Cho phép request đi tiếp sang Controller giỏ hàng
      next();

    } catch (error) {
      console.error('❌ Auth Middleware Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn.'
      });
    }
  }

  // Nếu không có Token nào được gửi lên
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Bạn không có quyền truy cập. Vui lòng đăng nhập!'
    });
  }
};
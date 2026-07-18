const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const db = require('../config/database');
const emailService = require('../ultis/sendEmail');

// Register controller
const register = async (req, res) => {
  let connection;
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không khớp'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
      });
    }

    connection = await db.getConnection();

    // Check if email already exists
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const [result] = await connection.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, 'user']
    );

    // Generate JWT token
    const token = jwt.sign(
  { id: result.insertId, email: email, role: 'user' }, 
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' }
);

    await connection.release();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: result.insertId,
          fullName: fullName,
          email: email,
          role: 'user'
        },
        token
      }
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

// Login controller
const login = async (req, res) => {
  let connection;
  try {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    connection = await db.getConnection();

    // Find user by email
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      await connection.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await connection.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Generate JWT token with expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '7d';
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role }, 
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn }
);

    await connection.release();

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role
        },
        token,
        expiresIn
      }
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

// Verify token (middleware)
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    
    const [users] = await connection.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    await connection.release();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

// Change password controller
const changePassword = async (req, res) => {
  let connection;
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // 1. Validation dữ liệu đầu vào cơ bản
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin mật khẩu'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không trùng khớp'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
      });
    }

    connection = await db.getConnection();

    // 2. Lấy thông tin mật khẩu mã hóa hiện tại trong DB
    const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      await connection.release();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản người dùng'
      });
    }

    const user = users[0];

    // 3. So sánh mật khẩu cũ người dùng nhập với mật khẩu cũ trong DB
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }

    // 4. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    await connection.release();

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    if (connection) await connection.release();
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

// 1. HÀM QUÊN MẬT KHẨU (GỌI ĐẾN EMAIL SERVICE)
const forgotPassword = async (req, res) => {
  let connection;
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ email' });
    }

    connection = await db.getConnection();
    const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    await connection.release();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Địa chỉ email này không tồn tại trong hệ thống'
      });
    }

    // Tạo mã OTP ngẫu nhiên 6 số
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mã hóa OTP và Email vào JWT Token (Hết hạn sau 10 phút, không lưu CSDL)
    const resetSecret = process.env.JWT_SECRET || 'your-secret-key';
    const resetToken = jwt.sign({ email, otpCode }, resetSecret, { expiresIn: '10m' });

    // ĐÃ CẬP NHẬT: Gọi hàm gửi mail từ file service riêng lẻ gọn gàng
    await emailService.sendOtpEmail(email, otpCode);

    return res.status(200).json({
      success: true,
      message: 'Mã xác thực OTP đã được gửi tới hòm thư của bạn!',
      resetToken
    });

  } catch (error) {
    if (connection) await connection.release();
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trong quá trình gửi mail hoặc xử lý hệ thống.'
    });
  }
};

// 2. HÀM ĐẶT LẠI MẬT KHẨU (GIỮ NGUYÊN)
const resetPassword = async (req, res) => {
  let connection;
  try {
    const { otpCode, newPassword, confirmPassword, resetToken } = req.body;

    if (!otpCode || !newPassword || !confirmPassword || !resetToken) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có tối thiểu 8 ký tự' });
    }

    let decoded;
    try {
      const resetSecret = process.env.JWT_SECRET || 'your-secret-key';
      decoded = jwt.verify(resetToken, resetSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Phiên xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại mã.'
      });
    }

    if (otpCode.toString() !== decoded.otpCode.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP xác thực không chính xác'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    connection = await db.getConnection();
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email]);
    await connection.release();

    return res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.'
    });

  } catch (error) {
    if (connection) await connection.release();
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật mật khẩu.'
    });
  }
};

// Logout
const logout = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  getCurrentUser,
  changePassword,
  forgotPassword, 
  resetPassword,
  logout
};
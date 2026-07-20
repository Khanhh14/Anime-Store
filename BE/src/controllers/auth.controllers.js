const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const db = require('../config/database');
const emailService = require('../ultis/sendEmail');

// Import thư viện xác thực chính thức của Google
const { OAuth2Client } = require('google-auth-library');
// Dán đúng mã Client ID của bạn vào đây để Backend verify token
const client = new OAuth2Client('911076441690-50oqg4h5a2g8ltr0v393g5tobkklb0lp.apps.googleusercontent.com');

// 🚀 CONTROLLER: ĐĂNG NHẬP BẰNG GOOGLE
const googleLogin = async (req, res) => {
  let connection;
  try {
    const { token } = req.body; // Lấy chuỗi credential (ID Token) từ Frontend gửi lên

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã xác thực Google Token'
      });
    }

    // 1. Xác thực ID Token trực tiếp với Google API
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '911076441690-50oqg4h5a2g8ltr0v393g5tobkklb0lp.apps.googleusercontent.com'
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Mã xác thực Google không hợp lệ hoặc đã hết hạn'
      });
    }

    // Lấy thông tin tài khoản mà Google trả về
    const { email, name, picture } = payload;

    connection = await db.getConnection();

    // 2. Kiểm tra xem tài khoản email này đã tồn tại trong DB chưa
    let [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    let user;

    if (users.length === 0) {
      // Nếu chưa có, tiến hành đăng ký tự động (JIT Registration)
      // Tạo một mật khẩu ngẫu nhiên để lấp đầy trường password bắt buộc trong DB
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const [result] = await connection.query(
        'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'user']
      );

      user = {
        id: result.insertId,
        full_name: name,
        email: email,
        role: 'user'
      };
    } else {
      // Nếu đã có, lấy thông tin user sẵn có
      user = users[0];
    }

    // 3. Khởi tạo mã JWT Token nội bộ của hệ thống bạn để cấp quyền truy cập cho FE
    const systemToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' } // Mặc định đăng nhập Google cho lưu phiên 7 ngày
    );

    await connection.release();

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập bằng Google thành công',
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role
        },
        token: systemToken
      }
    });

  } catch (error) {
    if (connection) await connection.release();
    console.error('Google Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trong quá trình xác thực Google.'
    });
  }
};

// Register controller
const register = async (req, res) => {
  let connection;
  try {
    const { fullName, email, password, confirmPassword } = req.body;

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

    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await connection.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, 'user']
    );

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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    connection = await db.getConnection();

    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      await connection.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await connection.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

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

    const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      await connection.release();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản người dùng'
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

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

// Forgot password
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

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetSecret = process.env.JWT_SECRET || 'your-secret-key';
    const resetToken = jwt.sign({ email, otpCode }, resetSecret, { expiresIn: '10m' });

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

// Reset password
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
// =========================================================================
// 👥 CÁC CONTROLLER QUẢN LÝ THÀNH VIÊN DÀNH CHO ADMIN
// =========================================================================

// 1. Lấy danh sách toàn bộ người dùng (Bảo mật: Không lấy trường password)
const getAllUsers = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    
    const [rows] = await connection.query(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC'
    );
    
    await connection.release();
    
    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách thành viên.'
    });
  }
};

// 2. Admin thêm tài khoản người dùng mới trực tiếp
const adminCreateUser = async (req, res) => {
  let connection;
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
      });
    }

    connection = await db.getConnection();

    // Kiểm tra email đã tồn tại hay chưa
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng bởi tài khoản khác'
      });
    }

    // Mã hóa mật khẩu giống hàm register của bạn
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, role]
    );

    await connection.release();

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành viên thành công'
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Admin create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trong quá trình tạo tài khoản.'
    });
  }
};

// 3. Admin cập nhật thông tin thành viên (Xử lý linh hoạt việc đổi mật khẩu)
const adminUpdateUser = async (req, res) => {
  let connection;
  try {
    const userId = req.params.id;
    const { full_name, email, role, password } = req.body;

    if (!full_name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên, email và vai trò là thông tin bắt buộc'
      });
    }

    connection = await db.getConnection();

    // Kiểm tra xem email có bị trùng với tài khoản khác không
    const [dupEmail] = await connection.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (dupEmail.length > 0) {
      await connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng bởi một tài khoản khác'
      });
    }

    // Nếu Admin điền mật khẩu mới -> Thực hiện mã hóa băm mật khẩu mới
    if (password && password.trim() !== '') {
      if (password.length < 8) {
        await connection.release();
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await connection.query(
        'UPDATE users SET full_name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [full_name, email, hashedPassword, role, userId]
      );
    } else {
      // Nếu Admin để trống ô mật khẩu -> Giữ nguyên mật khẩu cũ trong CSDL
      await connection.query(
        'UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?',
        [full_name, email, role, userId]
      );
    }

    await connection.release();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành viên thành công'
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Admin update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật thông tin thành viên.'
    });
  }
};

// 4. Admin xóa người dùng (Ngăn tự xóa chính bản thân)
const adminDeleteUser = async (req, res) => {
  let connection;
  try {
    const targetUserId = req.params.id;
    const adminId = req.user.id; // Lấy từ middleware xác thực token (req.user)

    // Ngăn chặn tình huống Admin tự tay xóa chính mình trong danh sách
    if (Number(targetUserId) === Number(adminId)) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể tự xóa tài khoản quản trị đang đăng nhập!'
      });
    }

    connection = await db.getConnection();

    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [targetUserId]);
    await connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản người dùng không tồn tại hoặc đã bị xóa trước đó'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa tài khoản thành viên thành công'
    });
  } catch (error) {
    if (connection) await connection.release();
    console.error('Admin delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa người dùng.'
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin, // Export hàm đăng nhập Google mới ra cho file Router gọi
  verifyToken,
  getCurrentUser,
  changePassword,
  forgotPassword, 
  resetPassword,
  logout,
  
  getAllUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
};
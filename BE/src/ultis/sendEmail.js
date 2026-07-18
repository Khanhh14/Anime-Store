const nodemailer = require('nodemailer');

// Cấu hình trình gửi thư (Transporter) kết nối với Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // Lấy trực tiếp từ file .env
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

/**
 * Hàm gửi mã OTP quên mật khẩu
 * @param {string} toEmail - Địa chỉ email người nhận
 * @param {string} otpCode - Mã số OTP sinh ra từ controller
 */
const sendOtpEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    // Trường 'from' sẽ lấy chính email cấu hình trong .env làm người gửi
    from: `"ANIME SHOP Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '[ANIME SHOP] Mã xác thực đặt lại mật khẩu của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">Xác Thực Đặt Lại Mật Khẩu</h2>
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quy trình (Mã có hiệu lực trong <b>10 phút</b>):</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ec4899; background: #f3f4f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #cbd5e1;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px;">Nếu bạn không yêu cầu thay đổi này, hãy bỏ qua email này an toàn.</p>
      </div>
    `
  };

  // Trả về một Promise để controller sử dụng async/await bắt lỗi
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmail
};
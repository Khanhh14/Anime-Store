const QRCode = require('qrcode');

/**
 * Tạo QR code base64 hoặc URL VietQR cho shop Anime
 * @param {Object} options
 * @param {'credit_cash'|'momo'|'zalopay'} options.type Loại phương thức thanh toán
 * @param {string} [options.soTaiKhoan] Số tài khoản ngân hàng
 * @param {string} [options.tenTaiKhoan] Tên chủ tài khoản
 * @param {number} options.soTien Số tiền thanh toán
 * @param {string} options.noiDung Nội dung chuyển khoản (VD: DH10)
 * @param {string} [options.soDienThoai] Số điện thoại MoMo / ZaloPay
 * @returns {Promise<string>} Mã QR (dạng URL VietQR hoặc base64 image)
 */
async function taoQRThanhToan({ type, soTaiKhoan, tenTaiKhoan, soTien, noiDung, soDienThoai }) {
  try {
    if (!soTien || soTien <= 0) {
      throw new Error('Số tiền thanh toán không hợp lệ');
    }

    switch (type) {
      case 'credit_cash': {
        if (!soTaiKhoan || !tenTaiKhoan) {
          throw new Error('Thiếu thông tin tài khoản ngân hàng');
        }

        const bankId = 'vcb'; // Vietcombank (hoặc mã ngân hàng khác: icb, mbb, tpb, vtb...)
        const encodedNoiDung = encodeURIComponent(noiDung);
        const encodedTen = encodeURIComponent(tenTaiKhoan);

        // Tạo URL ảnh VietQR chuẩn
        return `https://img.vietqr.io/image/${bankId}-${soTaiKhoan}-compact2.png?amount=${soTien}&addInfo=${encodedNoiDung}&accountName=${encodedTen}`;
      }

      case 'momo': {
        if (!soDienThoai) {
          throw new Error('Thiếu số điện thoại MoMo');
        }
        // Chuỗi chuẩn QR MoMo cá nhân
        const payload = `2|99|${soDienThoai}|||0|0|${soTien}|${noiDung}`;
        return await QRCode.toDataURL(payload);
      }

      case 'zalopay': {
        if (!soDienThoai) {
          throw new Error('Thiếu số điện thoại ZaloPay');
        }
        const payload = `https://zalopay.vn/payapp?phone=${soDienThoai}`;
        return await QRCode.toDataURL(payload);
      }

      default:
        throw new Error('Phương thức thanh toán không hợp lệ');
    }
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error);
    throw error;
  }
}

module.exports = {
  taoQRThanhToan
};
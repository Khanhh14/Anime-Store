// BE/src/controllers/stats.controllers.js
const db = require('../config/database') // Hoặc đường dẫn kết nối CSDL của bạn

exports.getStatsOverview = async (req, res) => {
  try {
    // Truy vấn tổng số lượng sản phẩm, thương hiệu và người dùng
    const [productsCount] = await db.query('SELECT COUNT(*) AS count FROM products');
    const [brandsCount] = await db.query('SELECT COUNT(*) AS count FROM brands'); // Hoặc SELECT COUNT(DISTINCT brand) FROM products
    const [usersCount] = await db.query('SELECT COUNT(*) AS count FROM users');

    return res.status(200).json({
      success: true,
      data: {
        products: productsCount[0]?.count || 0,
        brands: brandsCount[0]?.count || 0,
        users: usersCount[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê'
    });
  }
};
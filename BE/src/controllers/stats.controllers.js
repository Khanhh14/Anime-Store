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
// Thống kê Top 10 sản phẩm được yêu thích nhiều nhất
exports.getTopWishlistProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        p.image,
        p.stock,
        c.name AS category_name,
        COUNT(w.id) AS total_wishlist
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      GROUP BY p.id, p.name, p.price, p.image, p.stock, c.name
      ORDER BY total_wishlist DESC
      LIMIT 10
    `;

    const [stats] = await db.query(query);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Lỗi getTopWishlistProducts:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thống kê wishlist' });
  }
};
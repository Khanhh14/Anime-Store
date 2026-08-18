const db = require('../config/database');

// 1. Lấy danh sách sản phẩm yêu thích của user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT w.id AS wishlist_id, p.id AS product_id, 
             p.name, p.price, p.description, p.image, 
             c.name AS category_name, b.name AS brand_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `;

    const [wishlistItems] = await db.query(query, [userId]);

    return res.status(200).json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Lỗi getWishlist:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách yêu thích' });
  }
};

// 2. Thêm sản phẩm vào yêu thích (Tránh trùng lặp)
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Thiếu product_id' });
    }

    // Kiểm tra sản phẩm đã nằm trong wishlist chưa
    const [existing] = await db.query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }

    await db.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    return res.status(201).json({ success: true, message: 'Đã thêm vào danh sách yêu thích' });
  } catch (error) {
    console.error('Lỗi addToWishlist:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm yêu thích' });
  }
};

// 3. Xóa sản phẩm khỏi danh sách yêu thích
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [result] = await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong yêu thích' });
    }

    return res.status(200).json({ success: true, message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('Lỗi removeFromWishlist:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa khỏi yêu thích' });
  }
};

// 4. (Tùy chọn) Toggle: Tự động Thêm nếu chưa có, Xóa nếu đã có (Rất tiện cho Frontend)
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Thiếu product_id' });
    }

    const [existing] = await db.query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM wishlist WHERE id = ?', [existing[0].id]);
      return res.status(200).json({ success: true, isFavorited: false, message: 'Đã bỏ yêu thích' });
    } else {
      await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, product_id]);
      return res.status(201).json({ success: true, isFavorited: true, message: 'Đã thêm vào yêu thích' });
    }
  } catch (error) {
    console.error('Lỗi toggleWishlist:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
};

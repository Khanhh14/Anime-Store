const db = require('../config/database');

// Hàm Helper: Tìm hoặc tự động tạo mới giỏ hàng (carts) cho người dùng
const getOrCreateCartId = async (userId) => {
  let [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
  if (carts.length === 0) {
    const [newCart] = await db.query('INSERT INTO carts (user_id, created_at) VALUES (?, NOW())', [userId]);
    return newCart.insertId;
  }
  return carts[0].id;
};

// 1. Lấy danh sách sản phẩm trong giỏ hàng
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id; // Đã được Auth Middleware xác thực và gán chuẩn sau khi sửa lỗi SQL
    const cartId = await getOrCreateCartId(userId);

    const query = `
      SELECT ci.id AS cart_item_id, ci.product_id, ci.quantity, 
             p.name, p.price, p.description, p.image, 
             c.name as category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.cart_id = ?
      ORDER BY ci.id DESC
    `;
    const [cartItems] = await db.query(query, [cartId]);

    res.status(200).json({
      success: true,
      data: cartItems.map(item => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category_name: item.category_name,
        quantity: item.quantity,
        cart_item_id: item.cart_item_id
      }))
    });
  } catch (error) {
    console.error('Lỗi getUserCart:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy giỏ hàng', data: [] });
  }
};

// 2. Thêm sản phẩm hoặc tăng số lượng sản phẩm trong giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm hoặc số lượng' });
    }

    const cartId = await getOrCreateCartId(userId);

    // Kiểm tra sản phẩm đã nằm trong giỏ hàng chưa
    const [existingItems] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existingItems.length > 0) {
      // Nếu đã có, tiến hành cộng dồn số lượng mới từ frontend gửi lên
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, product_id]
      );
    } else {
      // Nếu chưa có, tạo mới bản ghi item trong giỏ
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity]
      );
    }
    res.status(201).json({ success: true, message: 'Thêm vào giỏ hàng thành công' });
  } catch (error) {
    console.error('Lỗi addToCart:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thêm vào giỏ hàng' });
  }
};

// 3. Xóa một sản phẩm cụ thể khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ success: false, message: 'Giỏ hàng trống' });

    await db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [carts[0].id, productId]);
    res.status(200).json({ success: true, message: 'Xóa khỏi giỏ hàng thành công' });
  } catch (error) {
    console.error('Lỗi removeFromCart:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm' });
  }
};
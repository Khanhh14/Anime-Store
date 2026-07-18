const db = require('../config/database');

// @desc Get ALL orders (For Admin)
// @route GET /api/orders/admin (Hoặc tùy biến theo route admin của bạn)
// @access Private (Admin Only)
exports.getAdminOrders = async (req, res) => {
  try {
    // Câu truy vấn lấy TOÀN BỘ đơn hàng trong hệ thống, không lọc theo user_id cá nhân
    const query = `
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.status, o.shipping_address, o.created_at as date
      FROM orders o
      ORDER BY o.created_at DESC
    `;
    
    const [orders] = await db.query(query);

    // Lấy danh sách chi tiết sản phẩm đi kèm cho từng đơn hàng
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemQuery = `
          SELECT oi.product_id as id, oi.quantity, oi.price,
                 p.name, p.description, p.image,
                 c.name as category_name
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE oi.order_id = ?
        `;
        const [items] = await db.query(itemQuery, [order.id]);
        return {
          ...order,
          items: items
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ordersWithItems
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng tổng quan hệ thống',
      data: []
    });
  }
};

// @desc Get user's orders (For Customers)
// @route GET /api/orders
// @access Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.status, o.shipping_address, o.created_at as date
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    
    const [orders] = await db.query(query, [userId]);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemQuery = `
          SELECT oi.product_id as id, oi.quantity, oi.price,
                 p.name, p.description, p.image,
                 c.name as category_name
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE oi.order_id = ?
        `;
        const [items] = await db.query(itemQuery, [order.id]);
        return {
          ...order,
          items: items
        };
      })
    );

    res.status(200).json({
      success: true,
      data: ordersWithItems
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
      data: []
    });
  }
};

// @desc Get single order
// @route GET /api/orders/:orderId
// @access Private
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const query = `
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.status, o.shipping_address, o.created_at as date
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `;
    
    const [orders] = await db.query(query, [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    const order = orders[0];

    // Get items for order
    const itemQuery = `
      SELECT oi.product_id as id, oi.quantity, oi.price,
             p.name, p.description, p.image,
             c.name as category_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = ?
    `;
    const [items] = await db.query(itemQuery, [orderId]);

    res.status(200).json({
      success: true,
      data: {
        ...order,
        items: items
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết đơn hàng'
    });
  }
};

// @desc Create order
// @route POST /api/orders
// @access Private
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { items, shipping_address, payment_method } = req.body;

    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng phải chứa ít nhất một sản phẩm'
      });
    }

    // Kiểm tra tính hợp lệ của payment_method (khớp với enum của CSDL)
    const validPayments = ['cod', 'banking'];
    const finalPaymentMethod = validPayments.includes(payment_method) ? payment_method : 'cod';

    // Calculate total
    let total = 0;
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        total += products[0].price * item.quantity;
      }
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, ?)',
      [userId, total, finalPaymentMethod, shipping_address || '', 'pending']
    );

    const orderId = orderResult.insertId;

    // Add items to order
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, products[0].price]
        );
      }
    }

    // Clear cart đúng cấu trúc liên kết 2 bảng carts -> cart_items
    const [userCart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (userCart.length > 0) {
      const cartId = userCart[0].id;
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }

    await connection.commit();
    await connection.release();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công 🚀',
      data: {
        orderId: orderId,
        total: total
      }
    });
  } catch (error) {
    await connection.rollback();
    await connection.release();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng'
    });
  }
};

// @desc Update order status & Deduct stock on confirmation / Allow Customer to cancel
// @route PUT /api/orders/:orderId
// @access Private (Admin & Customer)
exports.updateOrderStatus = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { orderId } = req.params;
    const { status } = req.body;
    const loggedInUserId = req.user.id; // ID của người đang gửi request (lấy từ token)

    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ!'
      });
    }

    // 1. Lấy thông tin đơn hàng hiện tại từ cơ sở dữ liệu
    const [currentOrder] = await connection.query('SELECT status, user_id FROM orders WHERE id = ?', [orderId]);
    if (currentOrder.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    const oldStatus = currentOrder[0].status;
    const orderOwnerId = currentOrder[0].user_id;

    // 2. KIỂM TRA QUYỀN HỦY ĐƠN DÀNH CHO CUSTOMER
    // Nếu người gửi yêu cầu chính là chủ đơn hàng (Customer tự hủy đơn của mình)
    if (loggedInUserId === orderOwnerId) {
      // Khách hàng CHỈ được phép gửi status là 'cancelled'
      if (status !== 'cancelled') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ 
          success: false, 
          message: 'Khách hàng không có quyền tự chuyển đơn hàng sang trạng thái này!' 
        });
      }

      // Khách hàng CHỈ được hủy khi trạng thái cũ là 'pending' (Đang xử lý)
      if (oldStatus !== 'pending') {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          success: false, 
          message: 'Đơn hàng đã được xử lý hoặc đang giao, khách hàng không thể hủy bỏ!' 
        });
      }
    } 
    // Nếu người gửi yêu cầu KHÔNG PHẢI chủ đơn hàng, hệ thống mặc định kiểm tra quyền Admin (nếu bạn có chia route riêng thì không sao)

    // 3. LOGIC TRỪ KHO: Nếu chuyển từ trạng thái khác sang 'confirmed' (Chỉ Admin thao tác được luồng này)
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
      
      for (const item of items) {
        const [product] = await connection.query('SELECT stock, name FROM products WHERE id = ?', [item.product_id]);
        if (product.length > 0) {
          const currentStock = product[0].stock;
          if (currentStock < item.quantity) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
              success: false,
              message: `Sản phẩm "${product[0].name}" không đủ số lượng trong kho (Còn lại: ${currentStock})`
            });
          }
          await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }
      }
    }

    // 4. Cập nhật trạng thái đơn hàng mới vào Database
    await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    await connection.commit();
    connection.release();

    res.status(200).json({
      success: true,
      message: status === 'cancelled' 
        ? 'Bạn đã hủy đơn hàng thành công ❌' 
        : 'Cập nhật trạng thái đơn hàng và đồng bộ kho thành công 🚀'
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đơn hàng'
    });
  }
};
const db = require('../config/database');

// @desc Get ALL orders (For Admin)
// @route GET /api/orders/admin
// @access Private (Admin Only)
exports.getAdminOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.payment_status, o.status, o.shipping_address, o.created_at as date
      FROM orders o
      ORDER BY o.created_at DESC
    `;
    
    const [orders] = await db.query(query);

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
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.payment_status, o.status, o.shipping_address, o.created_at as date
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    
    const [orders] = await db.query(query, [userId]);

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
      SELECT o.id, o.user_id, o.total_price as total, o.payment_method, o.payment_status, o.status, o.shipping_address, o.created_at as date
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
    const { 
      items, 
      shipping_address, 
      payment_method, 
      shipping_fee, 
      coupon_id, 
      discount_amount 
    } = req.body;

    if (!items || items.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng phải chứa ít nhất một sản phẩm'
      });
    }

    // Chuẩn hóa phương thức thanh toán cho khớp với Enum DB
    // Nếu Frontend gửi 'banking' -> đổi thành 'credit_cash'
    let finalPaymentMethod = payment_method;
    if (payment_method === 'banking') {
      finalPaymentMethod = 'credit_cash';
    }
    const validPayments = ['cod', 'credit_cash', 'momo', 'zalopay'];
    if (!validPayments.includes(finalPaymentMethod)) {
      finalPaymentMethod = 'cod';
    }

    // 1. Tính toán giá trị hàng hóa thực tế từ database
    let merchandiseTotal = 0;
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        merchandiseTotal += products[0].price * item.quantity;
      }
    }

    const finalShippingFee = Number(shipping_fee || 0);
    const finalDiscountAmount = Number(discount_amount || 0);

    // 2. KIỂM TRA & GIẢM SỐ LƯỢNG VOUCHER TRONG DB
    if (coupon_id) {
      const [coupons] = await connection.query(
        'SELECT quantity, code, min_order_value FROM coupons WHERE id = ?', 
        [coupon_id]
      );

      if (coupons.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: 'Mã khuyến mãi không tồn tại!' });
      }

      const coupon = coupons[0];

      if (coupon.quantity !== null && coupon.quantity <= 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: `Mã giảm giá "${coupon.code}" đã hết lượt sử dụng!` });
      }

      if (merchandiseTotal < Number(coupon.min_order_value || 0)) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: 'Giá trị đơn hàng chưa đủ điều kiện áp dụng mã!' });
      }

      if (coupon.quantity !== null) {
        await connection.query(
          'UPDATE coupons SET quantity = quantity - 1 WHERE id = ? AND quantity > 0',
          [coupon_id]
        );
      }
    }

    // 3. Tính số tiền thanh toán cuối cùng
    let finalInvoiceTotal = merchandiseTotal + finalShippingFee - finalDiscountAmount;
    if (finalInvoiceTotal < 0) finalInvoiceTotal = 0;

    // 4. Lưu vào bảng orders (Mặc định payment_status là 'unpaid')
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, payment_method, payment_status, shipping_address, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, finalInvoiceTotal, finalPaymentMethod, 'unpaid', shipping_address || '', 'pending']
    );

    const orderId = orderResult.insertId;

    // 5. Thêm chi tiết vào order_items
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, products[0].price]
        );
      }
    }

    // 6. Xóa giỏ hàng của user
    const [userCart] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (userCart.length > 0) {
      const cartId = userCart[0].id;
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công 🚀',
      order_id: orderId, // Trả trực tiếp order_id cho Frontend dễ lấy
      data: {
        orderId: orderId,
        id: orderId,
        total: finalInvoiceTotal
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng'
    });
  }
};

// @desc Record Payment History (Ghi nhận lịch sử chuyển khoản từ PaymentModal)
// @route POST /api/payments
// @access Private
exports.recordPayment = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { order_id, payment_method, amount, content, status } = req.body;

    if (!order_id || !payment_method || !amount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin thanh toán bắt buộc'
      });
    }

    // 1. Thêm bản ghi vào bảng payments
    const [paymentResult] = await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount, content, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [order_id, payment_method, amount, content || `DH${order_id}`, status || 'pending']
    );

    // 2. Cập nhật phương thức thanh toán mới nhất vào bảng orders
    await connection.query(
      'UPDATE orders SET payment_method = ? WHERE id = ?',
      [payment_method, order_id]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Ghi nhận lịch sử thanh toán thành công!',
      payment_id: paymentResult.insertId
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi ghi nhận thông tin thanh toán'
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
    const { status, payment_status } = req.body;
    const loggedInUserId = req.user.id;

    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ!'
      });
    }

    const [currentOrder] = await connection.query('SELECT status, user_id FROM orders WHERE id = ?', [orderId]);
    if (currentOrder.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    const oldStatus = currentOrder[0].status;
    const orderOwnerId = currentOrder[0].user_id;

    // Kiểm tra quyền hủy đơn dành cho khách hàng
    if (loggedInUserId === orderOwnerId) {
      if (status !== 'cancelled') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ 
          success: false, 
          message: 'Khách hàng không có quyền tự chuyển đơn hàng sang trạng thái này!' 
        });
      }

      if (oldStatus !== 'pending') {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          success: false, 
          message: 'Đơn hàng đã được xử lý hoặc đang giao, khách hàng không thể hủy bỏ!' 
        });
      }
    } 

    // Logic trừ kho khi admin chuyển sang 'confirmed'
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

    // Cập nhật trạng thái đơn hàng (và trạng thái thanh toán nếu có truyền lên)
    if (status) {
      await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    }
    
    if (payment_status) {
      await connection.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, orderId]);
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      success: true,
      message: status === 'cancelled' 
        ? 'Bạn đã hủy đơn hàng thành công ❌' 
        : 'Cập nhật trạng thái đơn hàng thành công 🚀'
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
const db = require('../config/database');

// @desc Get ALL orders (For Admin)
// @route GET /api/orders/admin
// @access Private (Admin Only)
exports.getAdminOrders = async (req, res) => {
  try {
    // Đã loại bỏ các cột không tồn tại trong DB để tránh lỗi Unknown column
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
    
    // Đã loại bỏ các cột không tồn tại trong DB
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

    // Đã loại bỏ các cột không tồn tại trong DB
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
    // Đón nhận thông tin tiền ship và voucher từ client gửi lên để tính toán
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

    // Kiểm tra tính hợp lệ của payment_method (khớp với enum của CSDL)
    const validPayments = ['cod', 'banking'];
    const finalPaymentMethod = validPayments.includes(payment_method) ? payment_method : 'cod';

    // 1. Tính toán giá trị hàng hóa thực tế từ database (đảm bảo bảo mật)
    let merchandiseTotal = 0;
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        merchandiseTotal += products[0].price * item.quantity;
      }
    }

    const finalShippingFee = Number(shipping_fee || 0);
    const finalDiscountAmount = Number(discount_amount || 0);

    // 2. LOGIC KIỂM TRA & GIẢM SỐ LƯỢNG VOUCHER TRONG DB (Đã sửa thành bảng coupons)
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

      // Nếu số lượng lượt dùng bằng hoặc nhỏ hơn 0 (và không phải là NULL) thì chặn lại
      if (coupon.quantity !== null && coupon.quantity <= 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: `Mã giảm giá "${coupon.code}" đã hết lượt sử dụng!` });
      }

      // Kiểm tra điều kiện đơn hàng tối thiểu một lần nữa ở Backend
      if (merchandiseTotal < Number(coupon.min_order_value || 0)) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: 'Giá trị đơn hàng chưa đủ điều kiện áp dụng mã!' });
      }

      // Tiến hành trừ đi 1 lượt dùng trong CSDL bảng coupons (Nếu quantity không phải là NULL)
      if (coupon.quantity !== null) {
        await connection.query(
          'UPDATE coupons SET quantity = quantity - 1 WHERE id = ? AND quantity > 0',
          [coupon_id]
        );
      }
    }

    // 3. Tính số tiền thanh toán cuối cùng: Tiền hàng + Tiền ship - Tiền giảm giá
    let finalInvoiceTotal = merchandiseTotal + finalShippingFee - finalDiscountAmount;
    if (finalInvoiceTotal < 0) finalInvoiceTotal = 0; // Đảm bảo hóa đơn không bị âm

    // 4. Lưu vào bảng orders theo cấu trúc cột TRUYỀN THỐNG của bạn (Cách 2)
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, ?)',
      [userId, finalInvoiceTotal, finalPaymentMethod, shipping_address || '', 'pending']
    );

    const orderId = orderResult.insertId;

    // 5. Add items to order_items
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length > 0) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, products[0].price]
        );
      }
    }

    // 6. Clear cart đúng cấu trúc liên kết 2 bảng carts -> cart_items
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
      data: {
        orderId: orderId,
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

    // 3. LOGIC TRỪ KHO: Nếu chuyển từ trạng thái khác sang 'confirmed'
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
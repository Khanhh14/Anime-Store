const db = require("../config/database");

// @desc Get all payments
// @route GET /api/payments
// @access Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const query = "SELECT * FROM payments ORDER BY created_at DESC";
    const [payments] = await db.query(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get single payment by ID
// @route GET /api/payments/:id
// @access Private
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM payments WHERE id = ?";
    const [payments] = await db.query(query, [id]);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch thanh toán này",
      });
    }

    res.status(200).json({
      success: true,
      data: payments[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get payment by Order ID
// @route GET /api/payments/order/:orderId
// @access Private
exports.getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const query = "SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1";
    const [payments] = await db.query(query, [orderId]);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Chưa có thông tin thanh toán cho đơn hàng này",
      });
    }

    res.status(200).json({
      success: true,
      data: payments[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Create new payment transaction
// @route POST /api/payments
// @access Private
exports.createPayment = async (req, res) => {
  try {
    const { order_id, payment_method, amount, content, status } = req.body;

    if (!order_id || !payment_method || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ order_id, payment_method và amount",
      });
    }

    const paymentContent = content || `DH${order_id}`;
    const paymentStatus = status || "pending";

    const query = `
      INSERT INTO payments (order_id, payment_method, amount, content, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await db.query(query, [
      order_id,
      payment_method,
      amount,
      paymentContent,
      paymentStatus,
    ]);

    // Query lại để lấy đầy đủ dữ liệu thời gian chính xác từ Database
    const [newPayment] = await db.query("SELECT * FROM payments WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Tạo giao dịch thanh toán thành công!",
      data: newPayment[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo giao dịch thanh toán: " + error.message,
    });
  }
};

// @desc Update payment status
// @route PUT /api/payments/:id
// @access Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method, content, amount } = req.body;

    // Kiểm tra giao dịch có tồn tại không
    const [existingPayment] = await db.query(
      "SELECT * FROM payments WHERE id = ?",
      [id]
    );

    if (existingPayment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Giao dịch thanh toán không tồn tại hoặc đã bị xóa",
      });
    }

    const currentData = existingPayment[0];

    // Xử lý giá trị fallback chuẩn xác hơn
    const updatedMethod = payment_method !== undefined ? payment_method : currentData.payment_method;
    const updatedAmount = amount !== undefined ? amount : currentData.amount;
    const updatedContent = content !== undefined ? content : currentData.content;
    const updatedStatus = status !== undefined ? status : currentData.status;

    const updateQuery = `
      UPDATE payments 
      SET payment_method = ?, amount = ?, content = ?, status = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      updatedMethod,
      updatedAmount,
      updatedContent,
      updatedStatus,
      id,
    ]);

    // Query lại bản ghi vừa cập nhật để lấy `updated_at` thực tế từ DB
    const [updatedRows] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Cập nhật thanh toán thành công!",
      data: updatedRows[0], // Trả về toàn bộ data mới gồm cả updated_at
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật thanh toán: " + error.message,
    });
  }
};

// @desc Delete payment
// @route DELETE /api/payments/:id
// @access Private/Admin
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [payment] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);

    if (payment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Giao dịch thanh toán không tồn tại",
      });
    }

    await db.query("DELETE FROM payments WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Xóa giao dịch thanh toán thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa giao dịch thanh toán: " + error.message,
    });
  }
};
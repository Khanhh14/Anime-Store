const db = require("../config/database");

// @desc Get all reviews
// @route GET /api/reviews
// @access Public/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const query = "SELECT * FROM reviews ORDER BY created_at DESC";
    const [reviews] = await db.query(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get single review by ID
// @route GET /api/reviews/:id
// @access Public
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM reviews WHERE id = ?";
    const [reviews] = await db.query(query, [id]);

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá này",
      });
    }

    res.status(200).json({
      success: true,
      data: reviews[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get reviews by Product ID with User Full Name
// @route GET /api/reviews/product/:productId
// @access Public
exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // JOIN lấy full_name và email từ bảng users
    const query = `
      SELECT 
        r.*, 
        u.full_name AS user_name,
        u.email AS user_email
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC
    `;

    const [reviews] = await db.query(query, [productId]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Lỗi Query SQL Reviews:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Create new review
// @route POST /api/reviews
// @access Private
exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    // Validate các trường bắt buộc
    if (!user_id || !product_id || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ user_id, product_id và rating",
      });
    }

    // Kiểm tra số sao hợp lệ (từ 1 đến 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Số sao đánh giá (rating) phải từ 1 đến 5",
      });
    }

    const reviewComment = comment || "";

    const query = `
      INSERT INTO reviews (user_id, product_id, rating, comment, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(query, [
      user_id,
      product_id,
      rating,
      reviewComment,
    ]);

    res.status(201).json({
      success: true,
      message: "Tạo đánh giá thành công!",
      data: {
        id: result.insertId,
        user_id,
        product_id,
        rating,
        comment: reviewComment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo đánh giá: " + error.message,
    });
  }
};

// @desc Update review
// @route PUT /api/reviews/:id
// @access Private
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Kiểm tra đánh giá có tồn tại không
    const [existingReview] = await db.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Đánh giá không tồn tại hoặc đã bị xóa",
      });
    }

    const currentData = existingReview[0];

    const updatedRating = rating !== undefined ? rating : currentData.rating;
    const updatedComment = comment !== undefined ? comment : currentData.comment;

    // Validate số sao nếu có cập nhật
    if (updatedRating < 1 || updatedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Số sao đánh giá (rating) phải từ 1 đến 5",
      });
    }

    const updateQuery = `
      UPDATE reviews 
      SET rating = ?, comment = ? 
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      updatedRating,
      updatedComment,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công!",
      data: {
        id,
        user_id: currentData.user_id,
        product_id: currentData.product_id,
        rating: updatedRating,
        comment: updatedComment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật đánh giá: " + error.message,
    });
  }
};

// @desc Delete review
// @route DELETE /api/reviews/:id
// @access Private
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [review] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);

    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Đánh giá không tồn tại",
      });
    }

    await db.query("DELETE FROM reviews WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá: " + error.message,
    });
  }
};
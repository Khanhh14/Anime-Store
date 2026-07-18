const db = require("../config/database");


exports.getAllCategories = async (req, res) => {
  try {
    const query = "SELECT * FROM categories ORDER BY name ASC";
    const [categories] = await db.query(query);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get single category
// @route GET /api/categories/:id
// @access Public
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM categories WHERE id = ?";
    const [categories] = await db.query(query, [id]);

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục này",
      });
    }

    res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Create category
// @route POST /api/categories
// @access Private
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên danh mục",
      });
    }

    const query = "INSERT INTO categories (name, description) VALUES (?, ?)";
    const [result] = await db.query(query, [name, description || null]);

    res.status(201).json({
      success: true,
      message: "Thêm danh mục thành công!", // Đồng bộ alert với frontend
      data: {
        id: result.insertId,
        name,
        description: description || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thêm danh mục: " + error.message,
    });
  }
};

// @desc Update category
// @route PUT /api/categories/:id
// @access Private
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [existingCategory] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại hoặc đã bị xóa trước đó",
      });
    }

    const updateQuery = "UPDATE categories SET name = ?, description = ? WHERE id = ?";

    await db.query(updateQuery, [
      name || existingCategory[0].name,
      description !== undefined ? description : existingCategory[0].description,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công!", // Đồng bộ alert với frontend
      data: {
        id,
        name: name || existingCategory[0].name,
        description: description !== undefined ? description : existingCategory[0].description,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật danh mục: " + error.message,
    });
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
// @access Private
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [category] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    await db.query("DELETE FROM categories WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công!", 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa danh mục: " + error.message,
    });
  }
};
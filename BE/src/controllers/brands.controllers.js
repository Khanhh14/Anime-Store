const db = require("../config/database");

// @desc Get all brands
// @route GET /api/brands
// @access Public
exports.getAllBrands = async (req, res) => {
  try {
    const query = "SELECT * FROM brands ORDER BY name ASC";
    const [brands] = await db.query(query);

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Get single brand
// @route GET /api/brands/:id
// @access Public
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM brands WHERE id = ?";
    const [brands] = await db.query(query, [id]);

    if (brands.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu này",
      });
    }

    res.status(200).json({
      success: true,
      data: brands[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

// @desc Create brand
// @route POST /api/brands
// @access Private
exports.createBrand = async (req, res) => {
  try {
    // ĐỔI TỪ description THÀNH country ĐỂ KHỚP VỚI DATABASE TRÊN HÌNH MySQL
    const { name, country } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên thương hiệu",
      });
    }

    // Câu lệnh SQL chèn vào cột `country`
    const query = "INSERT INTO brands (name, country) VALUES (?, ?)";
    const [result] = await db.query(query, [name, country || null]);

    res.status(201).json({
      success: true,
      message: "Thêm thương hiệu thành công!", // Chuẩn hóa câu thông báo để Frontend alert ra cho đẹp
      data: {
        id: result.insertId,
        name,
        country: country || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thêm thương hiệu: " + error.message,
    });
  }
};


exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country } = req.body;

    const [existingBrand] = await db.query(
      "SELECT * FROM brands WHERE id = ?",
      [id]
    );

    if (existingBrand.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Thương hiệu không tồn tại hoặc đã bị xóa trước đó",
      });
    }

    // Cập nhật chuẩn theo trường country trong DB của bạn
    const updateQuery = "UPDATE brands SET name = ?, country = ? WHERE id = ?";

    await db.query(updateQuery, [
      name || existingBrand[0].name,
      country !== undefined ? country : existingBrand[0].country,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Cập nhật thương hiệu thành công!",
      data: {
        id,
        name: name || existingBrand[0].name,
        country: country !== undefined ? country : existingBrand[0].country,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật thương hiệu: " + error.message,
    });
  }
};


exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const [brand] = await db.query("SELECT * FROM brands WHERE id = ?", [id]);

    if (brand.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Thương hiệu không tồn tại",
      });
    }

    await db.query("DELETE FROM brands WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Xóa thương hiệu thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa thương hiệu: " + error.message,
    });
  }
};
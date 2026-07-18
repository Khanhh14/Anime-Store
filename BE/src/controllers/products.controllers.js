const path = require("path");
const fs = require("fs").promises;
const db = require("../config/database");

// @desc Get all products with images
// @route GET /api/products
// @access Public
exports.getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id 
      ORDER BY p.created_at DESC
    `;
    const [products] = await db.query(query);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(product => ({
        ...product,
        image: product.image,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // THAY ĐỔI CÂU LỆNH SQL TẠI ĐÂY: LEFT JOIN với bảng categories và brands để lấy dữ liệu
    const query = `
      SELECT p.*, c.name as category_name, b.name as brand_name, b.country 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id 
      WHERE p.id = ?
    `;
    
    const [products] = await db.query(query, [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = products[0];
    res.status(200).json({
      success: true,
      data: {
        ...product,
        image: product.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Upload product with image
// @route POST /api/products
// @access Private
exports.createProduct = async (req, res) => {
  try {
    const { category_id, brand_id, name, price, stock, description } = req.body;
    let imageName = null;

    if (req.file) {
      imageName = req.file.filename;
    }

    if (!name || !price || !category_id) {
      if (req.file) {
        await fs.unlink(path.join(__dirname, `../../public/uploads/${imageName}`));
      }
      return res.status(400).json({
        success: false,
        message: "Please provide required fields: name, price, category_id",
      });
    }

    const query =
      "INSERT INTO products (category_id, brand_id, name, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [
      category_id,
      brand_id,
      name,
      price,
      stock || 0,
      imageName,
      description || null,
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: result.insertId,
        category_id,
        brand_id,
        name,
        price,
        stock,
        image: imageName,
        description,
      },
    });
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(path.join(__dirname, `../../public/uploads/${req.file.filename}`));
      } catch (e) {
        console.error("Error deleting uploaded file:", e);
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update product with image
// @route PUT /api/products/:id
// @access Private
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, brand_id, name, price, stock, description } = req.body;

    const [existingProduct] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (existingProduct.length === 0) {
      if (req.file) {
        await fs.unlink(path.join(__dirname, `../../public/uploads/${req.file.filename}`));
      }
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imageName = existingProduct[0].image;

    if (req.file) {
      if (imageName) {
        try {
          await fs.unlink(path.join(__dirname, `../../public/uploads/${imageName}`));
        } catch (e) {
          console.error("Error deleting old image:", e);
        }
      }
      imageName = req.file.filename;
    }

    const updateQuery =
      "UPDATE products SET category_id = ?, brand_id = ?, name = ?, price = ?, stock = ?, image = ?, description = ? WHERE id = ?";
    
    await db.query(updateQuery, [
      category_id || existingProduct[0].category_id,
      brand_id || existingProduct[0].brand_id,
      name || existingProduct[0].name,
      price || existingProduct[0].price,
      stock !== undefined ? stock : existingProduct[0].stock,
      imageName,
      description || existingProduct[0].description,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        id,
        category_id: category_id || existingProduct[0].category_id,
        brand_id: brand_id || existingProduct[0].brand_id,
        name: name || existingProduct[0].name,
        price: price || existingProduct[0].price,
        stock: stock !== undefined ? stock : existingProduct[0].stock,
        image: imageName,
        description: description || existingProduct[0].description,
      },
    });
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(path.join(__dirname, `../../public/uploads/${req.file.filename}`));
      } catch (e) {
        console.error("Error deleting uploaded file:", e);
      }
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete product and its image
// @route DELETE /api/products/:id
// @access Private
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product[0].image) {
      try {
        await fs.unlink(path.join(__dirname, `../../public/uploads/${product[0].image}`));
      } catch (e) {
        console.error("Error deleting image:", e);
      }
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get products by category
// @route GET /api/products/category/:categoryId
// @access Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = "SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC";
    const [products] = await db.query(query, [categoryId]);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(product => ({
        ...product,
        image: product.image,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

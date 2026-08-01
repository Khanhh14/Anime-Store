const db = require("../config/database");

// 1. Lấy danh sách tất cả mã giảm giá
const getAllCoupons = async (req, res) => {
    try {
        // Nếu query param includeExpired=true thì trả về tất cả mã (dùng cho admin)
        const includeExpired = req.query.includeExpired === 'true';

        let sql = 'SELECT * FROM coupons';
        // Mặc định, chỉ lấy các mã chưa hết hạn (expiry_date >= hôm nay)
        if (!includeExpired) {
            sql += ' WHERE DATE(expiry_date) >= CURDATE()';
        }
        sql += ' ORDER BY id DESC';

        const [rows] = await db.query(sql);
        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Lỗi getAllCoupons:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách mã giảm giá.'
        });
    }
};

// 2. Tạo mã giảm giá mới
const createCoupon = async (req, res) => {
    // FIX: Bổ sung bóc tách trường 'quantity' từ req.body gửi lên
    const { code, type, discount_value, min_order_value, quantity, expiry_date } = req.body;

    // Validate dữ liệu đầu vào cơ bản
    if (!code || !type || discount_value === undefined || !expiry_date) {
        return res.json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Mã, loại mã, giá trị giảm, ngày hết hạn).'
        });
    }

    try {
        const uppercaseCode = code.trim().toUpperCase();

        // Kiểm tra xem mã trùng lặp không (Nếu DB chưa đặt UNIQUE)
        const [existing] = await db.query('SELECT id FROM coupons WHERE code = ?', [uppercaseCode]);
        if (existing.length > 0) {
            return res.json({
                success: false,
                message: 'Mã khuyến mãi này đã tồn tại trong hệ thống!'
            });
        }

        // FIX: Thêm cột `quantity` và thêm tham số `?` thứ 5 vào chuỗi truy vấn SQL
        await db.query(
            'INSERT INTO coupons (code, type, discount_value, min_order_value, quantity, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
            [
                uppercaseCode, 
                type, 
                discount_value, 
                min_order_value || 0, 
                quantity === undefined ? null : quantity, // Nếu frontend gửi null (vô hạn) thì lưu NULL vào database
                expiry_date
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Tạo mã giảm giá mới thành công!'
        });
    } catch (error) {
        console.error('Lỗi createCoupon:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo mã giảm giá.'
        });
    }
};

// 3. Cập nhật mã giảm giá
const updateCoupon = async (req, res) => {
    const { id } = req.params;
    // FIX: Bổ sung bóc tách trường 'quantity' khi admin chỉnh sửa
    const { code, type, discount_value, min_order_value, quantity, expiry_date } = req.body;

    if (!code || !type || discount_value === undefined || !expiry_date) {
        return res.json({
            success: false,
            message: 'Vui lòng điền đầy đủ các thông tin cần chỉnh sửa.'
        });
    }

    try {
        const uppercaseCode = code.trim().toUpperCase();

        // Kiểm tra xem mã sửa có bị trùng với mã của bản ghi khác không
        const [duplicateCheck] = await db.query('SELECT id FROM coupons WHERE code = ? AND id != ?', [uppercaseCode, id]);
        if (duplicateCheck.length > 0) {
            return res.json({
                success: false,
                message: 'Mã khuyến mãi mới bị trùng với một mã khác đang tồn tại!'
            });
        }

        // FIX: Thêm gán `quantity = ?` vào câu lệnh UPDATE trong SQL
        const [result] = await db.query(
            'UPDATE coupons SET code = ?, type = ?, discount_value = ?, min_order_value = ?, quantity = ?, expiry_date = ? WHERE id = ?',
            [
                uppercaseCode, 
                type, 
                discount_value, 
                min_order_value || 0, 
                quantity === undefined ? null : quantity, // Lưu chuẩn số lượng hoặc NULL vào database
                expiry_date, 
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Không tìm thấy mã giảm giá cần cập nhật.'
            });
        }

        return res.json({
            success: true,
            message: 'Cập nhật thông tin mã giảm giá thành công!'
        });
    } catch (error) {
        console.error('Lỗi updateCoupon:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật mã giảm giá.'
        });
    }
};

// 4. Xóa mã giảm giá
const deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM coupons WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Mã giảm giá không tồn tại hoặc đã bị xóa từ trước.'
            });
        }

        return res.json({
            success: true,
            message: 'Xóa mã giảm giá thành công!'
        });
    } catch (error) {
        console.error('Lỗi deleteCoupon:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa mã giảm giá.'
        });
    }
};

module.exports = {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
};
const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

// Cập nhật thông tin khách hàng
router.put("/update/:sdt", (req, res) => {
  const { sdt } = req.params;
  const { tenkh, email, diachi } = req.body;

  if (!tenkh || !email) {
    return res.status(400).json({ message: "Tên và email là bắt buộc" });
  }

  const query = `
    UPDATE khachhang
    SET tenkh = ?, email = ?, diachi = ?
    WHERE sdt = ?
  `;

  db.query(query, [tenkh, email, diachi, sdt], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật khách hàng:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    res.json({ message: "Cập nhật thành công" });
  });
});

module.exports = router;
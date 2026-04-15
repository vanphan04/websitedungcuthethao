const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.post("/", async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    const conn = db.promise();

    // 🔥 Lấy đúng sản phẩm + giá + tồn kho
    const [rows] = await conn.query(
      `
      SELECT 
        sp.masp,
        sp.tensp,
        COALESCE(v.price, sp.gia) AS price,
        v.stock,
        v.id AS variantId
      FROM sanpham sp
      JOIN sanpham_variant v ON sp.masp = v.masp
      WHERE v.id = ?
      `,
      [variantId]
    );

    // ❌ Không tồn tại
    if (rows.length === 0) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const product = rows[0];

    // ❌ Không đủ hàng
    if (quantity > product.stock) {
      return res.status(400).json({ error: "Không đủ hàng" });
    }

    // ❗ KHÔNG trừ kho ở đây (chỉ checkout mới trừ)

    res.json({
      message: "OK",
      product: {
        id: product.masp,
        name: product.tensp,
        price: product.price, // 🔥 QUAN TRỌNG
        variantId: product.variantId,
        quantity: quantity,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
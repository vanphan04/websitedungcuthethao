const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

// get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM sanpham", (err, sp) => {
    if (err) return res.status(500).json(err);

    db.query("SELECT * FROM sanpham_mausac", (err2, tk) => {
      if (err2) return res.status(500).json(err2);

      const result = sp.map((s) => ({
        ...s,
        tonkho_theomau: tk
          .filter((t) => t.masp === s.masp)
          .map((t) => ({ mamau: t.mamau, soluong: t.soluong })),
      }));

      res.json(result);
    });
  });
});

// detail
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM sanpham WHERE masp = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({ message: "Not found" });
      res.json(rows[0]);
    }
  );
});

// thêm
router.post("/", async (req, res) => {
  const { tensp, hinhanh, gia, mota, maloai, madm } = req.body;

  if (!tensp || !hinhanh || !gia || !mota || !maloai || !madm)
    return res.status(400).json({ error: "Thiếu dữ liệu" });

  const conn = db.promise();

  const [exist] = await conn.query(
    "SELECT * FROM sanpham WHERE tensp = ?",
    [tensp]
  );
  if (exist.length)
    return res.status(409).json({ error: "Trùng tên sản phẩm" });

  const [result] = await conn.query(
    `INSERT INTO sanpham (tensp,hinhanh,gia,mota,maloai,madm)
     VALUES (?,?,?,?,?,?)`,
    [tensp, hinhanh, gia, mota, maloai, madm]
  );

  res.json({ masp: result.insertId });
});

// sửa
router.put("/:id", async (req, res) => {
  const { tensp, hinhanh, gia, mota, maloai, madm } = req.body;
  const conn = db.promise();

  const [exist] = await conn.query(
    "SELECT * FROM sanpham WHERE tensp = ? AND masp != ?",
    [tensp, req.params.id]
  );

  if (exist.length)
    return res.status(409).json({ error: "Trùng tên sản phẩm" });

  await conn.query(
    `UPDATE sanpham SET tensp=?,hinhanh=?,gia=?,mota=?,maloai=?,madm=? WHERE masp=?`,
    [tensp, hinhanh, gia, mota, maloai, madm, req.params.id]
  );

  res.json({ message: "OK" });
});

// xoá
router.delete("/:id", (req, res) => {
  db.query(
    "SELECT * FROM sanpham_mausac WHERE masp=?",
    [req.params.id],
    (err, r) => {
      if (r.length)
        return res.status(400).json({ error: "Còn tồn kho" });

      db.query(
        "DELETE FROM sanpham WHERE masp=?",
        [req.params.id],
        () => res.json({ message: "Đã xoá" })
      );
    }
  );
});

module.exports = router;
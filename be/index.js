const express = require("express");
const cors = require("cors");
const db = require("./connectDB/db");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Public folder chứa ảnh
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ✅ API: Lấy tất cả sản phẩm
app.get("/api/sanpham", (req, res) => {
  db.query("SELECT * FROM sanpham", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ API: Lấy chi tiết 1 sản phẩm theo ID
app.get("/api/sanpham/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM sanpham WHERE masp = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(results[0]);
  });
});

//Gio hang
app.post("/api/giohang", (req, res) => {
  const { price, masp, makh, mahd } = req.body;

  const sql = `
    INSERT INTO giohang (price, masp, makh, mahd, trangthai)
    VALUES (?, ?, ?, ?, 'Chưa thanh toán')
  `;

  db.query(sql, [price, masp, makh, mahd], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Đã thêm vào giỏ hàng", insertedId: result.insertId });
  });
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

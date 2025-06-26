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

// ✅ API: Lấy danh sách loại sản phẩm
app.get("/api/loaisanpham", (req, res) => {
  db.query("SELECT * FROM loaisanpham", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ✅ API: Lấy sản phẩm theo mã loại
app.get("/api/sanpham/loai/:maloai", (req, res) => {
  const { maloai } = req.params;
  db.query("SELECT * FROM sanpham WHERE maloai = ?", [maloai], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ✅ API: Tìm kiếm sản phẩm
app.get("/api/sanpham/timkiem", (req, res) => {
  const { keyword } = req.query;

  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });
  }

  const searchKeyword = `%${keyword.trim()}%`;

  const sql = `
    SELECT sp.*
    FROM sanpham sp
    JOIN loaisanpham lsp ON sp.maloai = lsp.maloai
    WHERE sp.tensp LIKE ? OR lsp.tenloai LIKE ?
  `;

  db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
    if (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi tìm kiếm sản phẩm" });
    }
    res.json(results);
  });
});

// ✅ API: Lấy chi tiết sản phẩm
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

// ✅ API: Lấy sản phẩm theo mã danh mục
app.get("/api/sanpham/danhmuc/:madm", (req, res) => {
  const madm = req.params.madm;
  const sql = "SELECT * FROM sanpham WHERE madm = ?";
  db.query(sql, [madm], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// 🛒 Giỏ hàng
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

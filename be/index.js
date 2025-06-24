const express = require("express");
const cors = require("cors");
const db = require("./connectDB/db");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");

// Public folder chứa ảnh
app.use("/images", express.static(path.join(__dirname, "public/images")));


// ✅ API: Lấy danh sách sản phẩm từ bảng `sanpham`
app.get("/api/sanpham", (req, res) => {
  db.query("SELECT * FROM sanpham", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

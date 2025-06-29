// backend/index.js
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

// ✅ API: Lấy danh sách kích cỡ
app.get("/api/kichco", (req, res) => {
  db.query("SELECT * FROM kichco", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ API: Lấy danh sách màu sắc
app.get("/api/mausac", (req, res) => {
  db.query("SELECT * FROM mausac", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ API: Lấy danh sách danh mục
app.get("/api/danhmuc", (req, res) => {
  db.query("SELECT * FROM danhmuc", (err, results) => {
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

// 🛒 API: Thêm giỏ hàng
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

// ✅ API: Lấy danh sách đơn hàng
app.get("/api/hoadon", (req, res) => {
  const sql = `
    SELECT hd.mahd, hd.tongtien, hd.ngayxuat, hd.trangthai, hd.pttt,
           kh.tenkh,
           CASE WHEN hd.trangthai = 'Đã giao' THEN 'Đã thanh toán' ELSE 'Chưa thanh toán' END AS trangthai_thanhtoan
    FROM hoadon hd
    JOIN khachhang kh ON hd.makh = kh.makh
    ORDER BY hd.ngayxuat DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ API: Cập nhật trạng thái đơn hàng
app.put("/api/hoadon/:id", (req, res) => {
  const { trangthai } = req.body;
  const { id } = req.params;
  const sql = `UPDATE hoadon SET trangthai = ? WHERE mahd = ?`;
  db.query(sql, [trangthai, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

// ✅ API: Thanh toán không cần đăng nhập
app.post("/api/checkout", async (req, res) => {
  const { tenkh, sdt, diachi, email, cart, pttt, ghichu = null } = req.body;
  const conn = db.promise();

  try {
    await conn.query("START TRANSACTION");

    const [khResult] = await conn.query(
      "INSERT INTO khachhang (tenkh, sdt, email, diachi) VALUES (?, ?, ?, ?)",
      [tenkh, sdt, email, diachi]
    );
    const makh = khResult.insertId;

    const tongtien = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [hdResult] = await conn.query(
      "INSERT INTO hoadon (ngayxuat, tongtien, trangthai, manv, makh, pttt, ghichu) VALUES (NOW(), ?, 'Đã thanh toán', NULL, ?, ?, ?)",
      [tongtien, makh, pttt, ghichu]
    );
    const mahd = hdResult.insertId;

    for (const item of cart) {
      const quantity = parseInt(item.quantity);

      const [updateResult] = await conn.query(
        "UPDATE sanpham SET soluong = soluong - ? WHERE masp = ? AND soluong >= ?",
        [quantity, item.id, quantity]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Kho không đủ hàng cho sản phẩm có ID: ${item.id}`);
      }

      await conn.query(
        "INSERT INTO giohang (price, masp, makh, mahd, trangthai) VALUES (?, ?, ?, ?, 'Đã thanh toán')",
        [item.price * quantity, item.id, makh, mahd]
      );
    }

    await conn.query("COMMIT");
    res.json({ success: true, message: "Đặt hàng thành công!" });
  } catch (err) {
    await conn.query("ROLLBACK");

    if (err.message.startsWith("Kho không đủ hàng")) {
      return res.status(400).json({ success: false, message: err.message });
    }

    console.error("❌ Lỗi khi thanh toán:", err.message);
    res.status(500).json({ success: false, message: "Đặt hàng thất bại", error: err.message });
  }
});

app.get("/api/hoadon/:id/chitiet", async (req, res) => {
  const { id } = req.params;

  try {
    const [orderInfo] = await db.promise().query(
      `SELECT hd.mahd, hd.ngayxuat, hd.tongtien, hd.trangthai,hd.ghichu, hd.pttt, kh.tenkh
       FROM hoadon hd
       JOIN khachhang kh ON hd.makh = kh.makh
       WHERE hd.mahd = ?`,
      [id]
    );

    const [orderItems] = await db.promise().query(
      `SELECT sp.tensp, gh.price, gh.price / sp.gia AS quantity
       FROM giohang gh
       JOIN sanpham sp ON gh.masp = sp.masp
       WHERE gh.mahd = ?`,
      [id]
    );

    const processedItems = orderItems.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity),
    }));

    res.json({
      info: orderInfo[0],
      items: processedItems,
    });
  } catch (err) {
    console.error("Lỗi lấy chi tiết hóa đơn:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
});

app.post("/api/sanpham", (req, res) => {
  const {
    tensp,
    hinhanh,
    soluong,
    gia,
    mota,
    maloai,
    makichco,
    mamau,
    madm,
  } = req.body;

  const sql = `
    INSERT INTO sanpham (tensp, hinhanh, soluong, gia, mota, maloai, makichco, mamau, madm)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [tensp, hinhanh, soluong, gia, mota, maloai, makichco, mamau, madm],
    (err, result) => {
      if (err) {
        console.error("Lỗi thêm sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi thêm sản phẩm" });
      }
      res.json({ message: "Thêm sản phẩm thành công" });
    }
  );
});

// PUT: Cập nhật sản phẩm
app.put("/api/sanpham/:masp", (req, res) => {
  const { masp } = req.params;
  const {
    tensp,
    hinhanh,
    soluong,
    gia,
    mota,
    maloai,
    makichco,
    mamau,
    madm,
  } = req.body;

  const sql = `
    UPDATE sanpham SET 
      tensp = ?, 
      hinhanh = ?, 
      soluong = ?, 
      gia = ?, 
      mota = ?, 
      maloai = ?, 
      makichco = ?, 
      mamau = ?, 
      madm = ?
    WHERE masp = ?
  `;

  db.query(
    sql,
    [tensp, hinhanh, soluong, gia, mota, maloai, makichco, mamau, madm, masp],
    (err, result) => {
      if (err) {
        console.error("Lỗi cập nhật sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi cập nhật sản phẩm" });
      }
      res.json({ message: "Cập nhật sản phẩm thành công" });
    }
  );
});

// DELETE: Xóa sản phẩm
app.delete("/api/sanpham/:masp", (req, res) => {
  const { masp } = req.params;

  const sql = "DELETE FROM sanpham WHERE masp = ?";
  db.query(sql, [masp], (err, result) => {
    if (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi xóa sản phẩm" });
    }
    res.json({ message: "Xóa sản phẩm thành công" });
  });
});

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

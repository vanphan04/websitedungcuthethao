const express = require("express");
const cors = require("cors");
const db = require("./connectDB/db");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");
const connection = require("./connectDB/db");

const app = express();
app.use(cors());
app.use(express.json());

//folder chứa ảnh
app.use("/images", express.static(path.join(__dirname, "public/images")));

//login
const bcrypt = require("bcrypt");
const { url } = require("inspector");

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM nhanvien WHERE BINARY username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi server" });
      if (results.length === 0)
        return res.status(401).json({ error: "Tài khoản không tồn tại" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(401).json({ error: "Sai mật khẩu" });

      res.json({
        message: "Đăng nhập thành công",
        userId: user.id,
        hoten: user.hoten,
      });
    }
  );
});

//Lấy tất cả sản phẩm
app.get("/api/sanpham", (req, res) => {
  const querySanpham = "SELECT * FROM sanpham";
  const queryTonKho = "SELECT * FROM sanpham_mausac";

  db.query(querySanpham, (err, sanphamResults) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(queryTonKho, (err2, tonkhoResults) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Gộp tồn kho theo màu vào từng sản phẩm
      const productsWithTonkho = sanphamResults.map((sp) => {
        const tonkho = tonkhoResults
          .filter((tk) => tk.masp === sp.masp)
          .map((tk) => ({
            mamau: tk.mamau,
            soluong: tk.soluong,
          }));

        return { ...sp, tonkho_theomau: tonkho };
      });

      res.json(productsWithTonkho);
    });
  });
});

//Lấy danh sách loại sản phẩm
app.get("/api/loaisanpham", (req, res) => {
  db.query("SELECT * FROM loaisanpham", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//Thêm loại sản phẩm
app.post("/api/loaisanpham", (req, res) => {
  const { tenloai } = req.body;
  if (!tenloai)
    return res.status(400).json({ error: "Tên loại không được để trống" });

  // Kiểm tra tên đã tồn tại
  db.query(
    "SELECT * FROM loaisanpham WHERE tenloai = ?",
    [tenloai],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        return res.status(409).json({ error: "Tên loại sản phẩm đã tồn tại" });
      }

      // Nếu không trùng thì thêm mới
      db.query(
        "INSERT INTO loaisanpham (tenloai) VALUES (?)",
        [tenloai],
        (err, result) => {
          if (err)
            return res.status(500).json({ error: "Lỗi thêm loại sản phẩm" });
          res.json({ message: "Thêm loại sản phẩm thành công" });
        }
      );
    }
  );
});

//Sửa loại sản phẩm
app.put("/api/loaisanpham/:maloai", (req, res) => {
  const { maloai } = req.params;
  const { tenloai } = req.body;
  if (!tenloai)
    return res.status(400).json({ error: "Tên loại không được để trống" });

  // Kiểm tra nếu tên mới đã tồn tại ở loại khác
  db.query(
    "SELECT * FROM loaisanpham WHERE tenloai = ? AND maloai != ?",
    [tenloai, maloai],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        return res.status(409).json({ error: "Tên loại sản phẩm đã tồn tại" });
      }

      // Nếu không trùng thì cập nhật
      db.query(
        "UPDATE loaisanpham SET tenloai = ? WHERE maloai = ?",
        [tenloai, maloai],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Lỗi cập nhật loại sản phẩm" });
          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ error: "Không tìm thấy loại sản phẩm" });
          }
          res.json({ message: "Cập nhật loại sản phẩm thành công" });
        }
      );
    }
  );
});

//Xóa loại sản phẩm nếu không còn sản phẩm liên kết
app.delete("/api/loaisanpham/:maloai", (req, res) => {
  const { maloai } = req.params;

  db.query(
    "SELECT COUNT(*) AS total FROM sanpham WHERE maloai = ?",
    [maloai],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result[0].total > 0) {
        return res.status(400).json({
          error: "Không thể xóa loại sản phẩm vì vẫn còn sản phẩm liên quan",
        });
      }

      db.query(
        "DELETE FROM loaisanpham WHERE maloai = ?",
        [maloai],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ error: "Không tìm thấy loại sản phẩm để xóa" });
          }

          res.json({ message: "Xóa loại sản phẩm thành công" });
        }
      );
    }
  );
});

// Lấy danh sách màu sắc
app.get("/api/mausac", (req, res) => {
  db.query("SELECT * FROM mausac", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
//mâmu
app.get("/api/mausac/:mamau", (req, res) => {
  const { mamau } = req.params;
  db.query(
    "SELECT tenmau FROM mausac WHERE mamau = ?",
    [mamau],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Không tìm thấy màu sắc" });
      res.json(results[0]);
    }
  );
});
// API lấy toàn bộ sản phẩm kèm màu sắc
app.get("/api/sanpham-full", (req, res) => {
  const sql = `
      SELECT sp.*, ms.tenmau
      FROM sanpham sp
      LEFT JOIN sanpham_mausac sm ON sp.masp = sm.masp
      LEFT JOIN mausac ms ON sm.mamau = ms.mamau
      ORDER BY sp.masp
    `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Gom nhóm sản phẩm theo masp
    const map = new Map();
    results.forEach((row) => {
      if (!map.has(row.masp)) {
        map.set(row.masp, {
          masp: row.masp,
          tensp: row.tensp,
          hinhanh: row.hinhanh,
          soluong: 0,
          gia: row.gia,
          loai: row.loai,
          madm: row.madm,
          mausac: [],
        });
      }
      if (row.tenmau) {
        map.get(row.masp).mausac.push(row.tenmau);
      }
    });

    const products = Array.from(map.values());
    res.json(products);
  });
});

// Thêm màu sắc
app.post("/api/mausac", (req, res) => {
  const { tenmau } = req.body;
  if (!tenmau)
    return res.status(400).json({ error: "Tên màu sắc là bắt buộc" });

  // Kiểm tra trùng tên
  db.query(
    "SELECT * FROM mausac WHERE tenmau = ?",
    [tenmau],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0)
        return res.status(409).json({ error: "Tên màu sắc đã tồn tại" });

      db.query("INSERT INTO mausac (tenmau) VALUES (?)", [tenmau], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thêm màu sắc thành công" });
      });
    }
  );
});

// Cập nhật màu sắc
app.put("/api/mausac/:mamau", (req, res) => {
  const { mamau } = req.params;
  const { tenmau } = req.body;

  if (!tenmau)
    return res.status(400).json({ error: "Tên màu sắc là bắt buộc" });

  // Kiểm tra trùng tên
  db.query(
    "SELECT * FROM mausac WHERE tenmau = ? AND mamau != ?",
    [tenmau, mamau],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0)
        return res.status(409).json({ error: "Tên màu sắc đã tồn tại" });

      db.query(
        "UPDATE mausac SET tenmau = ? WHERE mamau = ?",
        [tenmau, mamau],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Cập nhật thành công" });
        }
      );
    }
  );
});

// Xóa màu sắc
app.delete("/api/mausac/:mamau", (req, res) => {
  const { mamau } = req.params;

  // 1. Kiểm tra xem màu sắc này còn được dùng không
  const checkQuery = "SELECT * FROM sanpham_mausac WHERE mamau = ?";
  db.query(checkQuery, [mamau], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi kiểm tra dữ liệu" });

    if (results.length > 0) {
      // Có ít nhất 1 sản phẩm đang dùng màu này
      return res.status(400).json({
        error: "Không thể xóa vì còn sản phẩm đang sử dụng màu này.",
      });
    }

    // 2. Nếu không có sản phẩm dùng màu này, tiến hành xóa
    const deleteQuery = "DELETE FROM mausac WHERE mamau = ?";
    db.query(deleteQuery, [mamau], (err2) => {
      if (err2)
        return res.status(500).json({ error: "Lỗi khi xóa màu sắc" });

      res.json({ message: "Xóa màu sắc thành công." });
    });
  });
});


//Lấy danh sách danh mục
app.get("/api/danhmuc", (req, res) => {
  const sql = "SELECT * FROM danhmuc";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn danh mục:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
});

// Thêm danh mục
app.post("/api/danhmuc", (req, res) => {
  const { tendm } = req.body;
  if (!tendm)
    return res.status(400).json({ error: "Tên danh mục không được để trống" });

  // Kiểm tra tên đã tồn tại
  db.query("SELECT * FROM danhmuc WHERE tendm = ?", [tendm], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(409).json({ error: "Tên danh mục đã tồn tại" });
    }

    // Nếu không trùng thì thêm mới
    db.query(
      "INSERT INTO danhmuc (tendm) VALUES (?)",
      [tendm],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi thêm danh mục" });
        res.json({ message: "Thêm danh mục thành công" });
      }
    );
  });
});

// Sửa danh mục
app.put("/api/danhmuc/:madm", (req, res) => {
  const { madm } = req.params;
  const { tendm } = req.body;
  if (!tendm)
    return res.status(400).json({ error: "Tên danh mục không được để trống" });

  // Kiểm tra nếu tên mới đã tồn tại ở danh mục khác
  db.query(
    "SELECT * FROM danhmuc WHERE tendm = ? AND madm != ?",
    [tendm, madm],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        return res.status(409).json({ error: "Tên danh mục đã tồn tại" });
      }

      // Nếu không trùng thì cập nhật
      db.query(
        "UPDATE danhmuc SET tendm = ? WHERE madm = ?",
        [tendm, madm],
        (err, result) => {
          if (err)
            return res.status(500).json({ error: "Lỗi cập nhật danh mục" });
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy danh mục" });
          }
          res.json({ message: "Cập nhật danh mục thành công" });
        }
      );
    }
  );
});

// Xóa danh mục nếu không còn sản phẩm liên kết
app.delete("/api/danhmuc/:madm", (req, res) => {
  const { madm } = req.params;

  db.query(
    "SELECT COUNT(*) AS total FROM sanpham WHERE madm = ?",
    [madm],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result[0].total > 0) {
        return res.status(400).json({
          error: "Không thể xóa danh mục vì vẫn còn sản phẩm liên quan",
        });
      }

      db.query("DELETE FROM danhmuc WHERE madm = ?", [madm], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Không tìm thấy danh mục để xóa" });
        }

        res.json({ message: "Xóa danh mục thành công" });
      });
    }
  );
});

//Lấy sản phẩm theo mã loại
app.get("/api/sanpham/loai/:maloai", (req, res) => {
  const { maloai } = req.params;
  db.query(
    "SELECT * FROM sanpham WHERE maloai = ?",
    [maloai],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});
// GET /api/sanpham/:id/mausac
app.get("/api/sanpham/:id/mausac", (req, res) => {
  const { id } = req.params;
  const sql = `
      SELECT sm.mamau, ms.tenmau, sm.soluong
      FROM sanpham_mausac sm
      JOIN mausac ms ON sm.mamau = ms.mamau
      WHERE sm.masp = ?
    `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results); // mảng [{ mamau, tenmau, soluong }, ...]
  });
});
// GET /api/sanpham/:id/stock?mamau=1
app.get("/api/sanpham/:id/stock", (req, res) => {
  const { id } = req.params;
  const { mamau } = req.query;
  const sql = `
      SELECT soluong
      FROM sanpham_mausac
      WHERE masp = ? AND mamau = ?
    `;
  db.query(sql, [id, mamau], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.json({ soluong: 0 });
    res.json({ soluong: results[0].soluong });
  });
});

//Tìm kiếm sản phẩm
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

//Lấy chi tiết sản phẩm
app.get("/api/sanpham/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM sanpham WHERE masp = ?";
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  });
});

//sss
app.get("/api/sanpham/:masp", (req, res) => {
  const { masp } = req.params;
  const sql = `
      SELECT sp.*, sm.mamau, ms.tenmau, sm.soluong
      FROM sanpham sp
      LEFT JOIN sanpham_mausac sm ON sp.masp = sm.masp
      LEFT JOIN mausac ms ON sm.mamau = ms.mamau
      WHERE sp.masp = ?
    `;
  db.query(sql, [masp], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const product = {
      ...results[0],
      mausac: results.map((row) => ({
        mamau: row.mamau,
        tenmau: row.tenmau,
        soluong: row.soluong,
      })),
    };

    res.json(product);
  });
});

//Lấy sản phẩm theo mã danh mục
app.get("/api/sanpham/danhmuc/:madm", (req, res) => {
  const madm = req.params.madm;
  const sql = "SELECT * FROM sanpham WHERE madm = ?";
  db.query(sql, [madm], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//Thêm giỏ hàng
app.post("/api/giohang", async (req, res) => {
  const { price, masp, makh, mahd, quantity } = req.body;
  const conn = db.promise();

  try {
    const [spRows] = await conn.query(
      "SELECT soluong FROM sanpham WHERE masp = ?",
      [masp]
    );

    if (spRows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    const tonKho = spRows[0].soluong;
    if (quantity > tonKho) {
      return res.status(400).json({ error: "Không đủ hàng trong kho" });
    }

    await conn.query(
      "UPDATE sanpham SET soluong = soluong - ? WHERE masp = ?",
      [quantity, masp]
    );

    await conn.query(
      `INSERT INTO giohang (price, masp, makh, mahd, trangthai, quantity, mamau)
   VALUES (?, ?, ?, ?, 'Chưa thanh toán', ?, ?)`,
      [price * quantity, masp, makh, mahd, quantity, mamau]
    );

    res.json({ message: "Đã thêm vào giỏ hàng và cập nhật tồn kho" });
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err.message);
    res.status(500).json({ error: "Lỗi server khi thêm giỏ hàng" });
  }
});

// Lấy danh sách đơn hàng
// Lấy danh sách tất cả đơn hàng
app.get("/api/hoadon", async (req, res) => {
  try {
    const [orders] = await connection.promise().query(`
      SELECT hd.*, kh.tenkh 
      FROM hoadon hd 
      JOIN khachhang kh ON hd.makh = kh.makh 
      ORDER BY hd.ngayxuat DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
// Cập nhật trạng thái đơn hàng
app.put("/api/hoadon/:id", (req, res) => {
  const { id } = req.params;
  const { trangthai } = req.body;

  if (!trangthai) {
    return res.status(400).json({ error: "Thiếu trạng thái mới." });
  }

  const sql = "UPDATE hoadon SET trangthai = ? WHERE mahd = ?";
  db.query(sql, [trangthai, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Cập nhật trạng thái thành công." });
  });
});
//Quản lý tồn kho
app.get("/api/tonkho", (req, res) => {
  const sql = `
      SELECT 
        sp.masp,
        sp.tensp,
        ms.mamau,
        ms.tenmau,
        sm.soluong
      FROM sanpham_mausac sm
      JOIN sanpham sp ON sm.masp = sp.masp
      JOIN mausac ms ON sm.mamau = ms.mamau
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi khi truy vấn tồn kho:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(result);
  });
});
// thêm vào kho
app.post("/api/tonkho", (req, res) => {
  const { masp, mamau, soluong } = req.body;

  // Kiểm tra thiếu thông tin
  if (!masp || !mamau || soluong == null) {
    return res.status(400).json({ error: "Thiếu dữ liệu gửi lên" });
  }

  const sql =
    "INSERT INTO sanpham_mausac (masp, mamau, soluong) VALUES (?, ?, ?)";

  db.query(sql, [masp, mamau, soluong], (err, result) => {
    if (err) {
      // Trường hợp bị trùng khóa chính (masp + mamau)
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "Kho này đã tồn tại. Vui lòng sửa số lượng thay vì thêm mới.",
        });
      }

      // Các lỗi khác
      console.error("Lỗi thêm kho:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi thêm tồn kho" });
    }

    // Thêm thành công
    res.json({ message: "Đã thêm tồn kho thành công", id: result.insertId });
  });
});

//sửa kho
app.put("/api/tonkho", (req, res) => {
  const { masp, mamau, soluong } = req.body;
  const sql =
    "UPDATE sanpham_mausac SET soluong = ? WHERE masp = ? AND mamau = ?";

  db.query(sql, [soluong, masp, mamau], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi cập nhật kho" });
    res.json({ message: "Cập nhật tồn kho thành công" });
  });
});
//xóa kho
app.delete("/api/tonkho/:masp/:mamau", (req, res) => {
  const { masp, mamau } = req.params;
  const sql = "DELETE FROM sanpham_mausac WHERE masp = ? AND mamau = ?";
  db.query(sql, [masp, mamau], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi xóa tồn kho" });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Không tìm thấy dòng tồn kho cần xóa" });
    res.json({ message: "Xóa thành công" });
  });
});

// Lấy chi tiết đơn hàng
app.get("/api/hoadon/:id/chitiet", async (req, res) => {
  const { id } = req.params;

  try {
    const conn = db.promise();

    // 1. Lấy thông tin hóa đơn
    const [orderInfo] = await conn.query(
      `SELECT hd.mahd, hd.ngayxuat, hd.tongtien, hd.trangthai, hd.ghichu, hd.pttt, hd.thanhtoan,
              kh.tenkh, kh.diachi, kh.sdt, kh.makh
       FROM hoadon hd
       LEFT JOIN khachhang kh ON hd.makh = kh.makh
       WHERE hd.mahd = ?`,
      [id]
    );

    if (orderInfo.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    }

    // 2. Lấy danh sách sản phẩm trong đơn hàng
    const [orderItems] = await conn.query(
      `SELECT 
          sp.tensp, 
          ms.tenmau AS mausac,
          gh.quantity,
          gh.price
       FROM giohang gh
       JOIN sanpham sp ON gh.masp = sp.masp
       LEFT JOIN mausac ms ON gh.mamau = ms.mamau
       WHERE gh.mahd = ?`,
      [id]
    );

    res.json({
      info: orderInfo[0],
      items: orderItems,
    });
  } catch (err) {
    console.error("Lỗi lấy chi tiết hóa đơn:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
});

//Thanh toán
app.post("/api/checkout", async (req, res) => {
  const { tenkh, email, sdt, diachi, ghichu, cart, pttt, tongtien } = req.body;

  if (
    !tenkh ||
    !email ||
    !sdt ||
    !diachi ||
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin hoặc giỏ hàng trống" });
  }

  try {
    // Kiểm tra tồn kho từng sản phẩm
    for (const item of cart) {
      const { masp, mamau, soluong } = item;

      const [rows] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT soluong FROM sanpham_mausac WHERE masp = ? AND mamau = ?",
          [masp, mamau],
          (err, result) => {
            if (err) return reject(err);
            resolve([result]);
          }
        );
      });

      if (rows.length === 0 || rows[0].soluong < soluong) {
        return res.status(400).json({
          message: `Không đủ hàng cho sản phẩm. Hiện có ${
            rows.length ? rows[0].soluong : 0
          }`,
        });
      }
    }

    // Thêm khách hàng
    const insertKhachHangQuery = `INSERT INTO khachhang (tenkh, sdt, email, diachi) VALUES (?, ?, ?, ?)`;
    const [khachHangResult] = await new Promise((resolve, reject) => {
      db.query(
        insertKhachHangQuery, 
        [tenkh, sdt, email, diachi],
        (err, result) => {
          if (err) return reject(err);
          resolve([result]);
        }
      );
    });
    const makh = khachHangResult.insertId;

    // Thêm hóa đơn
    const insertHoaDonQuery = `INSERT INTO hoadon (ngayxuat, tongtien, trangthai, thanhtoan, makh, pttt, ghichu) VALUES (NOW(), ?, 'Đang chuẩn bị', 'Chưa thanh toán', ?, ?, ?)`;
    const [hoaDonResult] = await new Promise((resolve, reject) => {
      db.query(
        insertHoaDonQuery,
        [tongtien, makh, pttt || "Tiền mặt", ghichu || ""],
        (err, result) => {
          if (err) return reject(err);
          resolve([result]);
        }
      );
    });
    const mahd = hoaDonResult.insertId;

    // Thêm giỏ hàng và trừ kho
    const insertGioHangQuery = `INSERT INTO giohang (masp, makh, quantity, mamau, price, mahd) VALUES (?, ?, ?, ?, ?, ?)`;

    for (const item of cart) {
      const { masp, mamau, soluong, gia } = item;

      // Thêm vào giỏ hàng
      await new Promise((resolve, reject) => {
        db.query(
          insertGioHangQuery,
          [masp, makh, soluong, mamau, gia, mahd],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      // Trừ tồn kho
      await new Promise((resolve, reject) => {
        db.query(
          `UPDATE sanpham_mausac SET soluong = soluong - ? WHERE masp = ? AND mamau = ?`,
          [soluong, masp, mamau],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    return res.status(200).json({ message: "Đặt hàng thành công", mahd });
  } catch (error) {
    console.error("Lỗi xử lý /api/checkout:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

///////////////////////Momo thanh toán
app.post("/api/momo/checkout", async (req, res) => {
  const { tenkh, email, sdt, diachi, ghichu, cart, pttt, tongtien } = req.body;

  if (
    !tenkh || !email || !sdt || !diachi ||
    !Array.isArray(cart) || cart.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin hoặc giỏ hàng trống" });
  }

  const connection = db;

  try {
    // 1. Kiểm tra tồn kho
    for (const item of cart) {
      const { masp, mamau, soluong } = item;

      const [rows] = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT soluong FROM sanpham_mausac WHERE masp = ? AND mamau = ?",
          [masp, mamau],
          (err, result) => {
            if (err) return reject(err);
            resolve([result]);
          }
        );
      });

      if (!rows.length || rows[0].soluong < soluong) {
        return res.status(400).json({
          message: `Không đủ hàng cho sản phẩm. Còn lại: ${
            rows.length ? rows[0].soluong : 0
          }`,
        });
      }
    }

    // 2. Thêm khách hàng
    const [khachHangResult] = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO khachhang (tenkh, sdt, email, diachi) VALUES (?, ?, ?, ?)",
        [tenkh, sdt, email, diachi],
        (err, result) => {
          if (err) return reject(err);
          resolve([result]);
        }
      );
    });
    const makh = khachHangResult.insertId;

    // 3. Thêm hóa đơn
    const [hoaDonResult] = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO hoadon (ngayxuat, tongtien, trangthai, thanhtoan, makh, pttt, ghichu) VALUES (NOW(), ?, 'Đang chuẩn bị', 'Chờ thanh toán', ?, ?, ?)",
        [tongtien, makh, pttt || "MoMo", ghichu || ""],
        (err, result) => {
          if (err) return reject(err);
          resolve([result]);
        }
      );
    });
    const mahd = hoaDonResult.insertId;

    // 4. Lưu giỏ hàng (chưa trừ kho)
    for (const item of cart) {
      const { masp, mamau, soluong, gia } = item;

      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO giohang (masp, makh, quantity, mamau, price, mahd) VALUES (?, ?, ?, ?, ?, ?)",
          [masp, makh, soluong, mamau, gia, mahd],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    // 5. Tạo đơn hàng MoMo
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const partnerCode = "MOMO";
    const redirectUrl = `http://localhost:3000/momo-success?mahd=${mahd}`;
    const ipnUrl = "https://webhook.site/your-url"; // hoặc endpoint của bạn để xác nhận thanh toán

    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = `Thanh toán đơn hàng #${mahd}`;
    const requestType = "payWithMethod";
    const extraData = "";

    const rawSignature =
      `accessKey=${accessKey}&amount=${tongtien}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount: tongtien,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      autoCapture: true,
      extraData,
      orderGroupId: "",
      signature,
    };

    const momoRes = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Tạo đơn hàng thành công",
      payUrl: momoRes.data.payUrl,
      mahd,
    });
  } catch (error) {
    console.error("Lỗi xử lý /api/momo/checkout:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});


//thêm sản phẩm
app.post("/api/sanpham", async (req, res) => {
  const { tensp, hinhanh, gia, mota, maloai, madm } = req.body;

  // Kiểm tra dữ liệu thiếu
  if (!tensp || !hinhanh || !gia || !mota || !maloai || !madm) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin sản phẩm" });
  }

  // Kiểm tra giá hợp lệ
  if (isNaN(gia) || gia <= 0) {
    return res.status(400).json({ error: "Giá sản phẩm phải là số lớn hơn 0" });
  }

  try {
    const conn = db.promise();

    // Kiểm tra sản phẩm trùng tên
    const [existRows] = await conn.query(
      "SELECT * FROM sanpham WHERE tensp = ?",
      [tensp]
    );
    if (existRows.length > 0) {
      return res.status(409).json({ error: "Tên sản phẩm đã tồn tại" });
    }

    // Thêm sản phẩm
    const sql = `
      INSERT INTO sanpham (tensp, hinhanh, gia, mota, maloai, madm)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(sql, [
      tensp,
      hinhanh,
      gia,
      mota,
      maloai,
      madm,
    ]);

    res
      .status(200)
      .json({ message: "Thêm sản phẩm thành công", masp: result.insertId });
  } catch (err) {
    console.error("Lỗi thêm sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server khi thêm sản phẩm" });
  }
});

// Tìm đơn hàng theo số điện thoại
app.get("/api/hoadon/sdt/:sdt", async (req, res) => {
  const sdt = req.params.sdt;

  try {
    // Tìm khách hàng theo số điện thoại
    const [khachhang] = await connection
      .promise()
      .query("SELECT makh FROM khachhang WHERE sdt = ?", [sdt]);

    if (khachhang.length === 0) {
      return res.json([]); // Không tìm thấy khách hàng
    }

    const makhList = khachhang.map((kh) => kh.makh); // Có thể có nhiều makh nếu số điện thoại trùng
    const [hoadon] = await connection
      .promise()
      .query("SELECT * FROM hoadon WHERE makh IN (?)", [makhList]);

    res.json(hoadon);
  } catch (error) {
    console.error("Lỗi khi tìm đơn hàng theo sdt:", error); // In chi tiết
    res.status(500).json({ error: "Lỗi server khi tìm đơn hàng" });
  }
});

// PUT: Cập nhật sản phẩm
app.put("/api/sanpham/:id", async (req, res) => {
  const { id } = req.params;
  const { tensp, hinhanh, gia, mota, maloai, madm } = req.body;

  if (!tensp || !hinhanh || !gia || !mota || !maloai || !madm) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin sản phẩm" });
  }

  if (isNaN(gia) || gia <= 0) {
    return res.status(400).json({ error: "Giá sản phẩm phải là số lớn hơn 0" });
  }

  try {
    const conn = db.promise();

    // Kiểm tra tên sản phẩm đã tồn tại nhưng KHÁC sản phẩm đang sửa
    const [existRows] = await conn.query(
      "SELECT * FROM sanpham WHERE tensp = ? AND masp != ?",
      [tensp, id]
    );
    if (existRows.length > 0) {
      return res.status(409).json({ error: "Tên sản phẩm đã tồn tại" });
    }

    const sql = `
      UPDATE sanpham
      SET tensp = ?, hinhanh = ?, gia = ?, mota = ?, maloai = ?, madm = ?
      WHERE masp = ?
    `;
    await conn.query(sql, [tensp, hinhanh, gia, mota, maloai, madm, id]);

    res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server khi cập nhật sản phẩm" });
  }
});

// API xóa sản phẩm nếu không còn tồn tại trong kho
app.delete("/api/sanpham/:masp", (req, res) => {
  const { masp } = req.params;

  // Kiểm tra xem sản phẩm có tồn tại trong bảng sanpham_mausac không
  const checkInventorySql = "SELECT * FROM sanpham_mausac WHERE masp = ?";

  db.query(checkInventorySql, [masp], (err, inventoryResults) => {
    if (err) {
      console.error("Lỗi khi kiểm tra kho:", err);
      return res.status(500).json({ error: "Lỗi kiểm tra kho sản phẩm" });
    }

    if (inventoryResults.length > 0) {
      return res
        .status(400)
        .json({ error: "Không thể xóa. Sản phẩm còn tồn tại trong kho." });
    }

    // Nếu không còn trong kho, thì xóa sản phẩm
    const deleteSql = "DELETE FROM sanpham WHERE masp = ?";
    db.query(deleteSql, [masp], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
      }

      return res.status(200).json({ message: "Xóa sản phẩm thành công" });
    });
  });
});

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

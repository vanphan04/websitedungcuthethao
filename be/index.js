const express = require("express");
const cors = require("cors");
const db = require("./connectDB/db");
const path = require("path");
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

//folder chứa ảnh
app.use("/images", express.static(path.join(__dirname, "public/images")));

//login
const bcrypt = require("bcrypt");

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM admin WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length === 0) return res.status(401).json({ error: "Tài khoản không tồn tại" });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) return res.status(401).json({ error: "Sai mật khẩu" });

    res.json({ message: "Đăng nhập thành công", adminId: admin.id, hoten: admin.hoten });
  });
});



//Lấy tất cả sản phẩm
app.get("/api/sanpham", (req, res) => {
  db.query("SELECT * FROM sanpham", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
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
  if (!tenloai) return res.status(400).json({ error: "Tên loại không được để trống" });

  // Kiểm tra tên đã tồn tại
  db.query("SELECT * FROM loaisanpham WHERE tenloai = ?", [tenloai], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(409).json({ error: "Tên loại sản phẩm đã tồn tại" });
    }

    // Nếu không trùng thì thêm mới
    db.query("INSERT INTO loaisanpham (tenloai) VALUES (?)", [tenloai], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi thêm loại sản phẩm" });
      res.json({ message: "Thêm loại sản phẩm thành công" });
    });
  });
});


//Sửa loại sản phẩm
app.put("/api/loaisanpham/:maloai", (req, res) => {
  const { maloai } = req.params;
  const { tenloai } = req.body;
  if (!tenloai) return res.status(400).json({ error: "Tên loại không được để trống" });

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
          if (err) return res.status(500).json({ error: "Lỗi cập nhật loại sản phẩm" });
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy loại sản phẩm" });
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

  db.query("SELECT COUNT(*) AS total FROM sanpham WHERE maloai = ?", [maloai], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result[0].total > 0) {
      return res.status(400).json({
        error: "Không thể xóa loại sản phẩm vì vẫn còn sản phẩm liên quan"
      });
    }

    db.query("DELETE FROM loaisanpham WHERE maloai = ?", [maloai], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy loại sản phẩm để xóa" });
      }

      res.json({ message: "Xóa loại sản phẩm thành công" });
    });
  });
});


// Lấy danh sách kích cỡ
app.get("/api/kichco", (req, res) => {
  db.query("SELECT * FROM kichco", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm kích cỡ
app.post("/api/kichco", (req, res) => {
  const { tenkichco } = req.body;
  if (!tenkichco) return res.status(400).json({ error: "Tên kích cỡ là bắt buộc" });

  // Kiểm tra trùng tên
  db.query("SELECT * FROM kichco WHERE tenkichco = ?", [tenkichco], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Tên kích cỡ đã tồn tại" });

    db.query("INSERT INTO kichco (tenkichco) VALUES (?)", [tenkichco], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Thêm kích cỡ thành công" });
    });
  });
});

// Cập nhật kích cỡ
app.put("/api/kichco/:makichco", (req, res) => {
  const { makichco } = req.params;
  const { tenkichco } = req.body;

  if (!tenkichco) return res.status(400).json({ error: "Tên kích cỡ là bắt buộc" });

  // Kiểm tra trùng tên
  db.query("SELECT * FROM kichco WHERE tenkichco = ? AND makichco != ?", [tenkichco, makichco], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Tên kích cỡ đã tồn tại" });

    db.query("UPDATE kichco SET tenkichco = ? WHERE makichco = ?", [tenkichco, makichco], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cập nhật thành công" });
    });
  });
});

// Xóa kích cỡ
app.delete("/api/kichco/:makichco", (req, res) => {
  const { makichco } = req.params;

  db.query("DELETE FROM kichco WHERE makichco = ?", [makichco], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa thành công" });
  });
});


// Lấy danh sách màu sắc
app.get("/api/mausac", (req, res) => {
  db.query("SELECT * FROM mausac", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm màu sắc
app.post("/api/mausac", (req, res) => {
  const { tenmau } = req.body;
  if (!tenmau) return res.status(400).json({ error: "Tên màu sắc là bắt buộc" });

  // Kiểm tra trùng tên
  db.query("SELECT * FROM mausac WHERE tenmau = ?", [tenmau], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Tên màu sắc đã tồn tại" });

    db.query("INSERT INTO mausac (tenmau) VALUES (?)", [tenmau], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Thêm màu sắc thành công" });
    });
  });
});

// Cập nhật màu sắc
app.put("/api/mausac/:mamau", (req, res) => {
  const { mamau } = req.params;
  const { tenmau } = req.body;

  if (!tenmau) return res.status(400).json({ error: "Tên màu sắc là bắt buộc" });

  // Kiểm tra trùng tên
  db.query("SELECT * FROM mausac WHERE tenmau = ? AND mamau != ?", [tenmau, mamau], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Tên màu sắc đã tồn tại" });

    db.query("UPDATE mausac SET tenmau = ? WHERE mamau = ?", [tenmau, mamau], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cập nhật thành công" });
    });
  });
});

// Xóa màu sắc
app.delete("/api/mausac/:mamau", (req, res) => {
  const { mamau } = req.params;

  db.query("DELETE FROM mausac WHERE mamau = ?", [mamau], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa thành công" });
  });
});


//Lấy danh sách danh mục
// Lấy danh sách danh mục
app.get("/api/danhmuc", (req, res) => {
  db.query("SELECT * FROM danhmuc ORDER BY madm DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm danh mục
app.post("/api/danhmuc", (req, res) => {
  const { tendm } = req.body;
  if (!tendm) return res.status(400).json({ error: "Tên danh mục không được để trống" });

  // Kiểm tra tên đã tồn tại
  db.query("SELECT * FROM danhmuc WHERE tendm = ?", [tendm], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(409).json({ error: "Tên danh mục đã tồn tại" });
    }

    // Nếu không trùng thì thêm mới
    db.query("INSERT INTO danhmuc (tendm) VALUES (?)", [tendm], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi thêm danh mục" });
      res.json({ message: "Thêm danh mục thành công" });
    });
  });
});

// Sửa danh mục
app.put("/api/danhmuc/:madm", (req, res) => {
  const { madm } = req.params;
  const { tendm } = req.body;
  if (!tendm) return res.status(400).json({ error: "Tên danh mục không được để trống" });

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
          if (err) return res.status(500).json({ error: "Lỗi cập nhật danh mục" });
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

  db.query("SELECT COUNT(*) AS total FROM sanpham WHERE madm = ?", [madm], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result[0].total > 0) {
      return res.status(400).json({
        error: "Không thể xóa danh mục vì vẫn còn sản phẩm liên quan"
      });
    }

    db.query("DELETE FROM danhmuc WHERE madm = ?", [madm], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy danh mục để xóa" });
      }

      res.json({ message: "Xóa danh mục thành công" });
    });
  });
});


//Lấy sản phẩm theo mã loại
app.get("/api/sanpham/loai/:maloai", (req, res) => {
  const { maloai } = req.params;
  db.query("SELECT * FROM sanpham WHERE maloai = ?", [maloai], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
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

  const sql = `
    SELECT 
      sp.*, 
      kc.tenkichco AS kichco, 
      ms.tenmau AS mausac
    FROM sanpham sp
    LEFT JOIN kichco kc ON sp.makichco = kc.makichco
    LEFT JOIN mausac ms ON sp.mamau = ms.mamau
    WHERE sp.masp = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn chi tiết sản phẩm:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(results[0]);
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
    const [spRows] = await conn.query("SELECT soluong FROM sanpham WHERE masp = ?", [masp]);

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
      `INSERT INTO giohang (price, masp, makh, mahd, trangthai) VALUES (?, ?, ?, ?, 'Chưa thanh toán')`,
      [price * quantity, masp, makh, mahd]
    );

    res.json({ message: "Đã thêm vào giỏ hàng và cập nhật tồn kho" });
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err.message);
    res.status(500).json({ error: "Lỗi server khi thêm giỏ hàng" });
  }
});



// Lấy danh sách đơn hàng
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

// Cập nhật trạng thái đơn hàng
app.put("/api/hoadon/:id", (req, res) => {
  const { trangthai } = req.body;
  const { id } = req.params;
  const sql = `UPDATE hoadon SET trangthai = ? WHERE mahd = ?`;
  db.query(sql, [trangthai, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

//Thanh toán không cần đăng nhập
app.post("/api/checkout", async (req, res) => {
  const { tenkh, sdt, diachi, email, cart, pttt, ghichu = null } = req.body;
  const conn = db.promise();
  const tongtien = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (pttt === "Momo") {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestType = "payWithMethod";
    const redirectUrl = "http://localhost:3000"; 
    const ipnUrl = "http://localhost:3001/api/momo/ipn";
    const orderInfo = "Thanh toán đơn hàng với MoMo";
    const amount = tongtien.toString();
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = Buffer.from(JSON.stringify({ tenkh, sdt, diachi, email, cart, ghichu })).toString("base64");

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
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

    try {
      const momoRes = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      return res.json({
        success: true,
        momo: true,
        payUrl: momoRes.data.payUrl,
        message: "Chuyển hướng đến cổng thanh toán MoMo",
      });
    } catch (err) {
      console.error("❌ Lỗi khi gọi MoMo:", err.message);
      return res.status(500).json({ success: false, message: "Tạo yêu cầu thanh toán MoMo thất bại" });
    }
  }

  // ✅ IPN - Ghi đơn hàng khi MoMo xác nhận thành công
app.post("/api/momo/ipn", async (req, res) => {
  const {
    partnerCode, orderId, requestId, amount, orderInfo, orderType,
    transId, resultCode, message, payType, responseTime, extraData, signature
  } = req.body;

  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  if (parseInt(resultCode) === 0) {
    const conn = db.promise();
    try {
      const decodedData = JSON.parse(Buffer.from(extraData, 'base64').toString());
      const { tenkh, sdt, diachi, email, cart, ghichu } = decodedData;

      await conn.query("START TRANSACTION");

      const [khResult] = await conn.query(
        "INSERT INTO khachhang (tenkh, sdt, email, diachi) VALUES (?, ?, ?, ?)",
        [tenkh, sdt, email, diachi]
      );
      const makh = khResult.insertId;

      const [hdResult] = await conn.query(
        "INSERT INTO hoadon (ngayxuat, tongtien, trangthai, manv, makh, pttt, ghichu) VALUES (NOW(), ?, 'Đã thanh toán', NULL, ?, 'Momo', ?)",
        [amount, makh, ghichu || null]
      );
      const mahd = hdResult.insertId;

      for (const item of cart) {
        const quantity = parseInt(item.quantity);
        const [updateResult] = await conn.query(
          "UPDATE sanpham SET soluong = soluong - ? WHERE masp = ? AND soluong >= ?",
          [quantity, item.id, quantity]
        );

        if (updateResult.affectedRows === 0) {
          throw new Error(`Kho không đủ hàng cho sản phẩm ID: ${item.id}`);
        }

        await conn.query(
          "INSERT INTO giohang (price, masp, makh, mahd, trangthai) VALUES (?, ?, ?, ?, 'Đã thanh toán')",
          [item.price * quantity, item.id, makh, mahd]
        );
      }

      await conn.query("COMMIT");
      return res.json({ success: true, message: "Đơn hàng đã được ghi nhận thành công" });
    } catch (err) {
      await conn.query("ROLLBACK");
      console.error("❌ Lỗi ghi đơn hàng IPN:", err.message);
      return res.status(500).json({ success: false, message: "Lưu đơn hàng thất bại" });
    }
  } else {
    return res.status(400).json({ message: "Thanh toán không thành công" });
  }
});

  // Thanh toán không qua MoMo (ví dụ: Tiền mặt)
  try {
    await conn.query("START TRANSACTION");

    const [khResult] = await conn.query(
      "INSERT INTO khachhang (tenkh, sdt, email, diachi) VALUES (?, ?, ?, ?)",
      [tenkh, sdt, email, diachi]
    );
    const makh = khResult.insertId;

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
    console.error("❌ Lỗi khi thanh toán:", err.message);
    res.status(500).json({ success: false, message: "Đặt hàng thất bại", error: err.message });
  }
});


//momo
   app.post("/payment", async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var requestType = "payWithMethod";
var amount = '50000';
var orderId = partnerCode + new Date().getTime();
var requestId = orderId;
var extraData ='';
var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
var orderGroupId ='';
var autoCapture =true;
var lang = 'vi';

//before sign HMAC SHA256 with format
//accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//puts raw signature
console.log("--------------------RAW SIGNATURE----------------")
console.log(rawSignature)
//signature
const crypto = require('crypto');
var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
console.log("--------------------SIGNATURE----------------")
console.log(signature)

//json object send to MoMo endpoint
const requestBody = JSON.stringify({
    partnerCode : partnerCode,
    partnerName : "Test",
    storeId : "MomoTestStore",
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    redirectUrl : redirectUrl,
    ipnUrl : ipnUrl,
    lang : lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData : extraData,
    orderGroupId: orderGroupId,
    signature : signature
});
//options for the request
    const options = {
        method: "POST",
        url:"https:\\test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Payment failed"
        });
    }
})

// Lấy chi tiết đơn hàng
app.get("/api/hoadon/:id/chitiet", async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy thông tin hóa đơn và khách hàng
    const [orderInfo] = await db.promise().query(
      `SELECT hd.mahd, hd.ngayxuat, hd.tongtien, hd.trangthai, hd.ghichu, hd.pttt,
              kh.tenkh, kh.diachi, kh.makh
       FROM hoadon hd
       LEFT JOIN khachhang kh ON hd.makh = kh.makh
       WHERE hd.mahd = ?`,
      [id]
    );

    // Lấy danh sách sản phẩm trong đơn hàng, kèm theo màu sắc và kích cỡ
    const [orderItems] = await db.promise().query(
      `SELECT 
          sp.tensp, 
          gh.price, 
          gh.price / sp.gia AS quantity,
          ms.tenmau AS mausac,
          kc.tenkichco AS kichco
       FROM giohang gh
       JOIN sanpham sp ON gh.masp = sp.masp
       LEFT JOIN mausac ms ON sp.mamau = ms.mamau
       LEFT JOIN kichco kc ON sp.makichco = kc.makichco
       WHERE gh.mahd = ?`,
      [id]
    );

    // Làm tròn quantity
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

//Xóa sản phẩm
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
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

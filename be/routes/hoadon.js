const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.get("/", async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT hd.*, kh.tenkh 
    FROM hoadon hd 
    JOIN khachhang kh ON hd.makh = kh.makh
  `);
  res.json(rows);
});

router.put("/:id", (req, res) => {
  db.query(
    "UPDATE hoadon SET trangthai=? WHERE mahd=?",
    [req.body.trangthai, req.params.id],
    () => res.json({ message: "OK" })
  );
});

module.exports = router;
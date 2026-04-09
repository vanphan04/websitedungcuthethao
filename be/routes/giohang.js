const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.post("/", async (req, res) => {
  const { masp, quantity } = req.body;

  const conn = db.promise();
  const [sp] = await conn.query(
    "SELECT soluong FROM sanpham WHERE masp=?",
    [masp]
  );

  if (quantity > sp[0].soluong)
    return res.status(400).json({ error: "Không đủ hàng" });

  await conn.query(
    "UPDATE sanpham SET soluong=soluong-? WHERE masp=?",
    [quantity, masp]
  );

  res.json({ message: "OK" });
});

module.exports = router;
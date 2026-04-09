const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM sanpham_mausac", (e, r) => res.json(r));
});

router.post("/", (req, res) => {
  const { masp, mamau, soluong } = req.body;

  db.query(
    "INSERT INTO sanpham_mausac VALUES (?,?,?)",
    [masp, mamau, soluong],
    () => res.json({ message: "OK" })
  );
});

module.exports = router;
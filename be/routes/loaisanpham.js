const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM loaisanpham", (e, r) => res.json(r));
});

router.post("/", (req, res) => {
  db.query(
    "INSERT INTO loaisanpham (tenloai) VALUES (?)",
    [req.body.tenloai],
    () => res.json({ message: "OK" })
  );
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM danhmuc", (e, r) => res.json(r));
});

router.post("/", (req, res) => {
  db.query(
    "INSERT INTO danhmuc (tendm) VALUES (?)",
    [req.body.tendm],
    () => res.json({ message: "OK" })
  );
});

router.put("/:id", (req, res) => {
  db.query(
    "UPDATE danhmuc SET tendm=? WHERE madm=?",
    [req.body.tendm, req.params.id],
    () => res.json({ message: "OK" })
  );
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM danhmuc WHERE madm=?",
    [req.params.id],
    () => res.json({ message: "OK" })
  );
});

module.exports = router;
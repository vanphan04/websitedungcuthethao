const express = require("express");
const router = express.Router();
const db = require("../connectDB/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM mausac", (e, r) => res.json(r));
});

router.post("/", (req, res) => {
  db.query(
    "INSERT INTO mausac (tenmau) VALUES (?)",
    [req.body.tenmau],
    () => res.json({ message: "OK" })
  );
});

router.put("/:id", (req, res) => {
  db.query(
    "UPDATE mausac SET tenmau=? WHERE mamau=?",
    [req.body.tenmau, req.params.id],
    () => res.json({ message: "OK" })
  );
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM mausac WHERE mamau=?",
    [req.params.id],
    () => res.json({ message: "OK" })
  );
});

module.exports = router;
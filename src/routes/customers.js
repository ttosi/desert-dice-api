const express = require("express");
const router = express.Router();
const snakecaseKeys = require("snakecase-keys");
const db = require("../database/database");

router.post("/", async (req, res) => {
  const body = snakecaseKeys(req.body);
  const { email, first_name, last_name, address1, address2, city, state, zip } =
    body;

  const result = await db.run(
    `INSERT INTO customer 
      (email, first_name, last_name, address1, address2, city, state, zip, created_at)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?,datetime('now'))`,
    [email, first_name, last_name, address1, address2, city, state, zip]
  );

  res.status(201).json({ id: result.lastID });
});

router.get("/:id", async (req, res) => {
  const customer = await db.fetchOne(`SELECT * FROM customer WHERE id = ?`, [
    req.params.id,
  ]);

  if (!customer) return res.status(404).json({ error: "Customer not found." });
  res.json(customer);
});

module.exports = router;

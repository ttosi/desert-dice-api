const express = require("express");
const router = express.Router();
const { fetchAll } = require("../database/database");

/* get all product categories */
router.get("/categories", async (req, res) => {
  const q = await fetchAll(
    "SELECT * FROM productCategory WHERE isActive = 1 ORDER BY sequence;"
  );
  res.json(q);
});

module.exports = router;

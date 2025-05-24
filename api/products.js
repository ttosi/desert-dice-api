const express = require("express");
const router = express.Router();
const { fetchAll, fetchOne } = require("../database/database");

router.get("/", async (req, res, next) => {
  const q = await fetchAll(
    "SELECT * FROM productCategory WHERE isActive = 1 ORDER BY sequence;"
  );
  res.json(q);
});

router.get("/:id", async (req, res, next) => {
  const q = await fetchOne(
    `SELECT * FROM product WHERE id = ${req.params.id} ;`
  );
  // console.log(req.params.id);
  res.json(q);
});

module.exports = router;

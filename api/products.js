const express = require("express");
const router = express.Router();
const { fetchAll } = require("../database/database");

/* get all products (does not return images) */
router.get("/", async (req, res) => {
  const q = await fetchAll("SELECT * FROM product WHERE sold IS NULL;");
  res.json(q);
});

/* get 3 latest featured products */
router.get("/featured", async (req, res) => {
  const q = await fetchAll(
    `SELECT * FROM product WHERE featured = 1 AND sold IS NULL ORDER BY created DESC LIMIT 3;`
  );
  q?.length ? res.json(q) : res.status(404);
});

/* get 3 latest products */
router.get("/latest", async (req, res) => {
  const q = await fetchAll(
    `SELECT * FROM product WHERE sold IS NULL ORDER BY created DESC LIMIT 3;`
  );
  q?.length ? res.json(q) : res.status(404);
});

router.get("/:id", async (req, res) => {
  const q = await fetchAll(
    `SELECT p.id, p.name, p.description, p.cost, p.discount, pi.path
     FROM product p 
     JOIN productImage pi on p.id = pi.productId
     WHERE p.id = ? AND sold IS NULL;`,
    [req.params.id]
  );

  if (!q?.length) {
    res.status(404).end();
  } else {
    res.json({
      name: q[0].name,
      description: q[0].description,
      cost: q[0].cost,
      discount: q[0].discount,
      images: q.map((i) => i.path),
    });
  }
});

module.exports = router;

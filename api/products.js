const express = require("express");
const router = express.Router();
const db = require("../database/database");

/* get all products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT p.id, p.name, p.description, p.cost, p.discount, pi.path AS images
     FROM product p 
     JOIN productImage pi on p.id = pi.productId
     WHERE p.sold IS NULL ORDER BY p.created ASC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* get the 3 latest featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT p.id, p.name, p.description, p.cost, p.discount, pi.path AS images
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE featured = 1 AND sold IS NULL ORDER BY created DESC LIMIT 3
     )
     ORDER BY p.created DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* get the 3 latest products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT p.id, p.name, p.description, p.cost, p.discount, pi.path AS images
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL ORDER BY created DESC LIMIT 3
     )
     ORDER BY p.created DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT p.id, p.name, p.description, p.cost, p.discount, pi.path AS images
     FROM product p 
     JOIN productImage pi on p.id = pi.productId
     WHERE p.id = ? AND p.sold IS NULL;`,
    [req.params.id]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows)[0]);
});

router.post("/", async (req, res) => {});

const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          cost: row.cost,
          discount: row.discount,
          images: [],
        };
      }
      acc[row.id].images.push(row.images);
      return acc;
    }, {})
  );
};

module.exports = router;

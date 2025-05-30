const express = require("express");
const router = express.Router();
const db = require("../database/database");

const selectColumns =
  "SELECT p.id, p.name, p.description, p.coverImage, p.price / 100.0 as price, pi.path AS image, p.sold, pi.thumbnail";

/* GET all available products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `${selectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL
     )
     ORDER BY p.created ASC;`
  );

  if (!rows?.length) return res.status(404).end();

  res.json(transformProducts(rows));
});

/* GET list of active product categories */
router.get("/categories", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT route, name FROM productCategory WHERE isActive = 1 ORDER BY sequence ASC;`
  );

  if (!rows?.length) return res.status(404).end();

  res.json(rows);
});

/* GET featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `${selectColumns}
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

/* GET 3 most recent products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `${selectColumns}
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

/* GET products by category slug */
router.get("/category/:category", async (req, res) => {
  const rows = await db.fetchAll(
    `${selectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id IN (
       SELECT p.id FROM product p
       JOIN productCategory pc ON pc.id = p.productCategoryId
       WHERE p.sold IS NULL AND pc.route = ?
     )
     ORDER BY p.created DESC;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();

  res.json(transformProducts(rows));
});

/* GET product by ID */
router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `${selectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL AND p.id = ?
     )
     ORDER BY p.created DESC;`,
    [req.params.id]
  );

  if (!rows?.length) return res.status(404).end();

  console.log(transformProducts(rows)[0]);
  res.json(transformProducts(rows)[0]);
});

router.post("/", async (req, res) => {});

/* Group flat product rows into structured product objects */
const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          coverImage: row.coverImage,
          price: row.price,
          sold: row.sold,
          created: row.created,
          images: [],
          thumbnails: [],
        };
      }
      row.thumbnail
        ? acc[row.id].thumbnails.push(row.image)
        : acc[row.id].images.push(row.image);
      return acc;
    }, {})
  );
};

module.exports = router;

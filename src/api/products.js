const express = require("express");
const router = express.Router();
const db = require("../database/database");

/* GET all products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.coverImagePath, p.coverPrice, p.isSold, p.created
     FROM product p
     JOIN productCategory pc ON pc.id = p.productCategoryId
     ORDER BY created DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET product categories */
router.get("/categories", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        id, route, name, description
     FROM productCategory
     WHERE isActive = 1
     ORDER BY sequence;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET products by category slug */
router.get("/category/:category", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.coverImagePath, p.coverPrice, p.isSold
     FROM product p
     JOIN productCategory pc ON pc.id = p.productCategoryId
     WHERE NOT p.isSold AND pc.route = ?
     ORDER BY created DESC;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.coverImagePath, p.coverPrice, p.isSold
     FROM product p
     JOIN productCategory pc ON pc.id = p.productCategoryId
     WHERE NOT p.isSold AND p.isFeatured = 1
     ORDER BY created DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET 3 most recent products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.coverImagePath, p.coverPrice, p.isSold
     FROM product p
     JOIN productCategory pc ON pc.id = p.productCategoryId
     WHERE NOT p.isSold
     ORDER BY created DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET product by ID */
router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT 
        p.id, p.name AS productName, p.description, p.coverImagePath, p.coverPrice, p.created,
        po.id AS productOptionId, po.name AS productOptionName, po.price AS optionPrice, po.isSold AS isProductOptionSold, po.notes, po.hasChonk,
        pi.id as productImageId, pi.path, pi.isThumbnail
     FROM product p
     LEFT JOIN productOption po ON p.id = po.productId
     LEFT JOIN productImage pi ON p.id = pi.productId
     WHERE p.id = ?
     ORDER BY po.sequence, pi.sequence;`,
    [req.params.id]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows)[0]);
});

router.post("/", async (req, res) => {});

/* Group product rows into structured product objects */
const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.productName,
          description: row.description,
          coverImagePath: row.coverImagePath,
          coverPrice: row.coverPrice,
          created: row.created,
          images: [],
          thumbnails: [],
          options: [],
        };
      }

      if (!acc[row.id].images.includes(row.path) && !row.isThumbnail) {
        acc[row.id].images.push(row.path);
      }

      if (!acc[row.id].thumbnails.includes(row.path) && row.isThumbnail) {
        acc[row.id].thumbnails.push(row.path);
      }

      if (!acc[row.id].options.find((o) => o.id === row.productOptionId)) {
        acc[row.id].options.push({
          id: row.productOptionId,
          name: row.productOptionName,
          price: row.optionPrice,
          isSold: row.isProductOptionSold,
          hasChonk: row.hasChonk,
          notes: row.notes,
        });
      }

      return acc;
    }, {})
  );
};

module.exports = router;

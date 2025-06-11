const express = require("express");
const router = express.Router();
// const db = require("../database/database");
// const db = require(path.join(global.appRoot, "src/database/database"));
const path = require("path");
const db = require(path.resolve(__dirname, "../database/database.js"));

/* GET all products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path AS coverImagePath, 
        p.cover_price / 100 AS coverPrice, p.is_sold AS isSold,
        p.created_at AS createdAt
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     ORDER BY p.created_at DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET product categories */
router.get("/categories", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        id, code, route, name, description
     FROM product_category
     WHERE is_active = 1
     ORDER BY sequence;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET products by category slug */
router.get("/category/:category", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path AS coverImagePath,
        p.cover_price / 100 AS coverPrice, p.is_sold AS isSold,
        pc.code, pc.description
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold AND pc.code = ?
     ORDER BY p.created_at DESC;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET products by 1 or more tag codes */
router.get("/tag/:tags", async (req, res) => {
  const tags = req.params.tags.split(",");
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path as coverImagePath,
        p.cover_price / 100 AS coverPrice, p.is_sold AS isSold
     FROM product p
     JOIN product_tag_map ptm ON ptm.product_id = p.id
     JOIN product_tag pt ON pt.id = ptm.tag_id
     WHERE pt.code IN (${tags.map(() => "?").join(", ")})
     ORDER BY created_at DESC; `,
    tags
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name,p.cover_image_path AS coverImagePath,
        p.cover_price / 100 AS coverPrice, p.is_sold AS isSold
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold AND p.is_featured = 1
     ORDER BY p.created_at DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET 3 most recent products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name,p.cover_image_path AS coverImagePath,
        p.cover_price / 100 AS coverPrice, p.is_sold AS isSold
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold
     ORDER BY p.created_at DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET product by ID */
router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT 
        p.id, p.name AS productName, p.description, p.cover_image_path,
        p.cover_price / 100, p.created_at, po.id AS productOptionId,
        po.name AS productOptionName, po.price / 100 AS optionPrice, po.notes,
        pi.id as productImageId, pi.path, pi.is_thumbnail
     FROM product p
     LEFT JOIN product_option po ON p.id = po.product_id
     LEFT JOIN product_image pi ON p.id = pi.product_id
     WHERE p.id = ?
     ORDER BY po.sequence, pi.sequence;`,
    [req.params.id]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows)[0]);
});

/* POST mark product as sold */
router.post("/marksold", async (req, res) => {
  const row = await db.fetchOne(`SELECT is_sold FROM product WHERE id = ?;`, [
    req.body.id,
  ]);

  if (row.is_sold) {
    res
      .status(409)
      .json({ err: "This item has been sold or is currently unavailable" });
    return;
  }

  await db.run(`UPDATE product SET is_sold = 1 where id = ?;`, [req.body.id]);
  res.status(200);
});

/* Group product rows into structured js objects */
const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.productName,
          description: row.description,
          coverImagePath: row.cover_image_path,
          coverPrice: row.cover_price,
          created: row.created_at,
          images: [],
          thumbnails: [],
          options: [],
        };
      }

      // images
      if (!acc[row.id].images.includes(row.path) && !row.is_thumbnail) {
        acc[row.id].images.push(row.path);
      }

      // thumbnails
      if (!acc[row.id].thumbnails.includes(row.path) && row.is_thumbnail) {
        acc[row.id].thumbnails.push(row.path);
      }

      // product options
      if (!acc[row.id].options.find((o) => o.id === row.productOptionId)) {
        acc[row.id].options.push({
          id: row.productOptionId,
          name: row.productOptionName,
          price: row.optionPrice,
          isSold: row.isProductOptionSold,
          notes: row.notes,
        });
      }

      return acc;
    }, {})
  );
};

module.exports = router;

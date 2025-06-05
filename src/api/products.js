const express = require("express");
const router = express.Router();
const db = require("../database/database");

/* GET all products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path AS coverImagePath, p.cover_price AS coverPrice,
        p.is_sold AS isSold, p.created_at AS createdAt
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
        id, route, name, description
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
        p.id, p.name, p.cover_image_path AS coverImagePath, p.cover_price AS coverPrice,
        p.is_sold AS isSold
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold AND pc.route = ?
     ORDER BY p.created_at DESC;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
});

/* GET products by tag code */
router.get("/tag/:tags", async (req, res) => {
  const tags = req.params.tags.split(",");

  console.log(tags);
  console.log(tags.map(() => "?").join(", "));

  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path as coverImagePath, p.cover_price AS coverPrice,
        p.is_sold AS isSold
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
        p.id, p.name,p.cover_image_path AS coverImagePath, p.cover_price AS coverPrice,
        p.is_sold AS isSold
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
        p.id, p.name,p.cover_image_path AS coverImagePath, p.cover_price AS coverPrice,
        p.is_sold AS isSold
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
        p.id, p.name AS productName, p.description, p.cover_image_path, p.cover_price, p.created_at,
        po.id AS productOptionId, po.name AS productOptionName, po.price AS optionPrice, po.is_sold AS isProductOptionSold, po.notes, po.has_chonk,
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
          coverImagePath: row.cover_image_path,
          coverPrice: row.cover_price,
          created: row.created_at,
          images: [],
          thumbnails: [],
          options: [],
        };
      }

      if (!acc[row.id].images.includes(row.path) && !row.is_thumbnail) {
        acc[row.id].images.push(row.path);
      }

      if (!acc[row.id].thumbnails.includes(row.path) && row.is_thumbnail) {
        acc[row.id].thumbnails.push(row.path);
      }

      if (!acc[row.id].options.find((o) => o.id === row.productOptionId)) {
        acc[row.id].options.push({
          id: row.productOptionId,
          name: row.productOptionName,
          price: row.optionPrice,
          isSold: row.isProductOptionSold,
          hasChonk: row.has_chonk,
          notes: row.notes,
        });
      }

      return acc;
    }, {})
  );
};

module.exports = router;

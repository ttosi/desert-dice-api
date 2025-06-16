const express = require("express");
const router = express.Router();
const db = require("../database/database");
const camelcaseKeys = require("camelcase-keys");
const snakecaseKeys = require("snakecase-keys");

/* GET all products */
router.get("/", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path, 
        p.cover_price / 100 AS cover_price, p.is_sold,
        p.created_at
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     ORDER BY p.created_at DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
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

/* GET products by category */
router.get("/category/:category", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path,
        p.cover_price / 100 AS cover_price, p.is_sold,
        pc.code, pc.description
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold AND p.reserved_at IS NULL AND pc.code = ?
     ORDER BY p.created_at DESC;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
});

/* GET products by 1 or more tags */
router.get("/tag/:tags", async (req, res) => {
  const tags = req.params.tags.split(",");
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path,
        p.cover_price / 100 AS cover_price, p.is_sold
     FROM product p
     JOIN product_tag_map ptm ON ptm.product_id = p.id
     JOIN product_tag pt ON pt.id = ptm.tag_id
     WHERE pt.code IN (${tags.map(() => "?").join(", ")})
     ORDER BY created_at DESC; `,
    tags
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
});

/* GET featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path,
        p.cover_price / 100 AS cover_price, p.is_sold
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold AND p.is_featured = 1
     ORDER BY p.created_at DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
});

/* GET 3 most recent products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        p.id, p.name, p.cover_image_path,
        p.cover_price / 100 AS cover_price, p.is_sold
     FROM product p
     JOIN product_category pc ON pc.id = p.category_id
     WHERE NOT p.is_sold
     ORDER BY p.created_at DESC
     LIMIT 3;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
});

/* GET product by ID */
router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT 
      p.id, p.name, p.description, p.cover_image_path,
	    p.cover_price / 100 AS cover_price, p.created_at, po.id AS option_id,
	    po.name AS option_name, po.price / 100 AS option_price, po.notes,
	    pi.id as product_image_id, pi.path, pi.is_thumbnail
     FROM product p
     LEFT JOIN product_option po ON p.id = po.product_id
     LEFT JOIN product_image pi ON p.id = pi.product_id
     WHERE p.id = ?
     ORDER BY po.sequence, pi.sequence;`,
    [req.params.id]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(transformProducts(rows)[0]));
});

router.get("/isavailable/:id", async (req, res) => {
  const row = await db.fetchOne(
    `SELECT is_sold, reserved_at FROM product WHERE id = ?;`,
    [req.params.id]
  );

  if (!row || row.is_sold || row.reserved_at) {
    res.status(200).json({ available: false });
    return;
  }

  res.status(200).json({ available: true });
});

/* PATCH update product */
router.patch("/:id", async (req, res) => {
  const props = Object.entries(snakecaseKeys(req.body));
  const fields = props.map((p) => `${p[0]} = ?`).join(", ");
  const values = props.map((p) => p[1]);

  await db.run(
    `UPDATE product SET ${fields} WHERE id = ${req.params.id};`,
    values
  );

  res.status(200);
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
          ...row,
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
      if (!acc[row.id].options.find((o) => o.id === row.option_id)) {
        acc[row.id].options.push({
          id: row.option_id,
          name: row.option_name,
          price: row.option_price,
          notes: row.notes,
        });
      }
      return acc;
    }, {})
  );
};

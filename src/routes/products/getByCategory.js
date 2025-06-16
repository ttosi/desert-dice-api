const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
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
};

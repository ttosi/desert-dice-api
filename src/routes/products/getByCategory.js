const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT 
      p.id, p.name, p.cover_image_path,
      p.cover_price / 100 AS cover_price, p.is_sold,
      pc.code, pc.description,
      pt.id AS tag_id, pt.code AS tag_code, pt.name AS tag_name
    FROM product p
    JOIN product_category pc ON pc.id = p.category_id
    JOIN product_tag_map pm ON pm.product_id = p.id
    JOIN product_tag pt ON pt.id = pm.tag_id
    WHERE NOT p.is_sold AND p.reserved_at IS NULL AND pc.code = ?
    ORDER BY p.created_at DESC;`,
    [req.params.category]
  );

  console.log(req.params.category);
  console.log(rows);

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(transformProducts(rows)));
};

const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          ...row,
          tags: [],
        };
      }

      // tags
      if (!acc[row.id].tags.includes(row.tag_code)) {
        acc[row.id].tags.push(row.tag_code);
      }
      return acc;
    }, {})
  );
};

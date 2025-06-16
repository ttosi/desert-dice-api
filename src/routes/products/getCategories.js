const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT
        id, code, route, name, description
     FROM product_category
     WHERE is_active = 1
     ORDER BY sequence;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(rows);
};

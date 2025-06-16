const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT DISTINCT 
        pt.id, pt.code, pt.name
     FROM product_tag pt
     JOIN product_tag_map ptm ON pt.id = ptm.tag_id
     JOIN product p ON ptm.product_id = p.id
     JOIN product_category pc ON p.category_id = pc.id
     WHERE pc.code = ?;`,
    [req.params.category]
  );

  if (!rows?.length) return res.status(404).end();
  res.json(camelcaseKeys(rows));
};

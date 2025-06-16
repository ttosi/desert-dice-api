const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  /* get tags by category where tag has active product(s) */
  // this will populate the tag list sidebar
  // SELECT DISTINCT
  // 	pt.id, pt.code, pt.name
  // FROM product_tag pt
  // JOIN product_tag_map ptm ON pt.id = ptm.tag_id
  // JOIN product p ON ptm.product_id = p.id
  // JOIN product_category pc ON p.category_id = pc.id
  // WHERE pc.code = 'dice';

  // TODO: implement patch
  res.status(501).json({ error: "Not implemented" });
};

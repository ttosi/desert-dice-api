const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  /* get product list by category and tag codes */
  //this will populate the products list based on
  // one or more selected tags
  // SELECT
  //   pt.name
  // FROM product p
  // JOIN product_category pc ON p.category_id = pc.id
  // JOIN product_tag_map ptm ON p.id = ptm.product_id
  // JOIN product_tag pt ON ptm.tag_id = pt.id
  // WHERE pt.code IN ('fullset', 'misfit') AND pc.code = 'dice';

  // TODO: implement patch
  res.status(501).json({ error: "Not implemented" });
};

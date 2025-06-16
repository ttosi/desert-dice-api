const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
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
};

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

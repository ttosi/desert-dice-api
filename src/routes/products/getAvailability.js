const db = require("../../database/database");
const camelcaseKeys = require("camelcase-keys");

module.exports = async (req, res) => {
  const row = await db.fetchOne(
    `SELECT is_sold, reserved_at FROM product WHERE id = ?;`,
    [req.params.id]
  );

  if (!row || row.is_sold || row.reserved_at) {
    res.status(200).json({ available: false });
    return;
  }

  res.status(200).json({ available: true });
};

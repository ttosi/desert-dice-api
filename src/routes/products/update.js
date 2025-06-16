const db = require("../../database/database");
const snakecaseKeys = require("snakecase-keys");

module.exports = async (req, res) => {
  const props = Object.entries(snakecaseKeys(req.body));
  const fields = props.map((p) => `${p[0]} = ?`).join(", ");
  const values = props.map((p) => p[1]);

  await db.run(
    `UPDATE product SET ${fields} WHERE id = ${req.params.id};`,
    values
  );

  res.status(200);
};

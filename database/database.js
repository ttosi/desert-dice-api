const sqlite = require("sqlite3");

console.log(__dirname);

// use .env
const filename = `${__dirname}/desert-dice.db`;

const fetchAll = async (sql, params) => {
  const db = await new sqlite.Database(filename);
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const fetchOne = async (sql, params) => {
  const db = await new sqlite.Database(filename);
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, rows) => {
      if (err) reject(err);
      console.log(rows);
      resolve(rows ? rows[0] : null);
    });
  });
};

module.exports = { fetchAll, fetchOne };

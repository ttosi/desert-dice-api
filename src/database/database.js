const sqlite = require("sqlite3");
require("dotenv").config();

const database = {
  db: new sqlite.Database(`${__dirname}/${process.env.DB_FILEPATH}`),
  fetchAll: async (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
  fetchOne: async (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },
  run: async (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.db.run(sql, params, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  },
};

process.on("SIGINT", () => {
  database.db.close((err) => {
    if (err) console.error("Error closing SQLite DB:", err);
    else console.log("\ndatabase closed.");
    process.exit();
  });
});

module.exports = database;

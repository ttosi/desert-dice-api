require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const path = require("path");
const sqlite = require("sqlite3");
const snakecaseKeys = require("snakecase-keys");

const databasePath = path.resolve(__dirname, `${process.env.DATABASE_PATH}`);
console.log("database loaded from:", databasePath);

const database = {
  db: new sqlite.Database(databasePath),
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
      database.db.run(sql, params, function (err, res) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  },
  objectToInsertFields(obj) {
    const props = Object.entries(snakecaseKeys(obj));
    const fields = props.map((p) => `${p[0]}`).join(", ");
    const params = props.map((p) => "?").join(", ");
    const values = props.map((p) => p[1]);

    return { fields, params, values };
  },
  objectToUpdateFields() {
    const props = Object.entries(snakecaseKeys(obj));
    const fields = props.map((p) => `${p[0]} = ?`).join(", ");
    const values = props.map((p) => p[1]);

    return { fields, values };
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

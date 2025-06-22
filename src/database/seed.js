const db = require("./database");
const snakecaseKeys = require("snakecase-keys");

const seed = {
  test() {
    console.log("test from seed");
  },
  async createProduct(product) {
    const { fields, params, values } = db.objectToInsertFields(product);
    console.log(fields);
    console.log(params);
    console.log(values);

    // const id = await db.run(
    //   `INSERT INTO customer (first_name, last_name, email) VALUES (?, ?, ?)`,
    //   ["Tony", "Tosi", "tony@example.com"]
    // );
    // console.log("----->", id);
  },
};

module.exports = seed;

const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const products = require("./api/products");
const customers = require("./api/customers");

const app = express();
require("dotenv").config();

// const categories = async () => {
//   const q = await fetchAll("SELECT * FROM productCategory WHERE isActive = 1;");
//   console.log(q);
// };
// categories();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use("/api/products/", products);
app.use("/api/customers/", customers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

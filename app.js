const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const products = require("./api/products");
const customers = require("./api/customers");

// const { notFound, errorHandler } = require("./middlewares");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use("/api/products", products);
app.use("/api/customers", customers);

// app.use(notFound);
// app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// module.exports = app;

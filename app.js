const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const { authorizeRequest } = require("./src/authorization");
const products = require("./src/api/products");
const customers = require("./src/api/customers");

const router = express.Router();
const app = express();
require("dotenv").config();

// var corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200
// };

app.use("/images", express.static(`${__dirname}/public/images`));

app.use(router);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use("/api/products/", products);
app.use("/api/customers/", customers);

router.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  await authorizeRequest(res, token);
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

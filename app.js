const express = require("express");
// const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const { authorizeRequest } = require("./src/services/authorization");
const products = require("./src/api/products");
const customers = require("./src/api/customers");

const router = express.Router();
const app = express();

// var corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200
// };

app.use("/images", express.static(`${__dirname}/public/images`));
if (process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "prod")
  app.use(express.static(`${__dirname}/dist`));

app.use(router);
app.use(cors());
// app.use(helmet());
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
try {
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
} catch (err) {
  console.error("Fatal startup error:", err);
  process.exit(1);
}

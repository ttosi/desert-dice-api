require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
const app = express();

const { authorizeRequest } = require("./src/services/auth");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) =>
      o.trim()
    );

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/images", express.static(`${__dirname}/public/images`));
if (process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "prod")
  app.use(express.static(`${__dirname}/dist`));

app.use(router);
app.use(bodyParser.json());

app.use("/api/products", require("./src/routes/products"));
app.use("/api", require("./src/routes/checkout"));
// app.use("/api", require("./src/routes/customers"));

router.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  await authorizeRequest(res, token);
  next();
});

// const seed = require("./src/database/seed");
// (async () => {
//   await seed.createProduct({
//     name: "prod 1",
//     description: "",
//     coverImagePath: "",
//     coverPrice: 4000,
//   });
// })();

// const email = require("./src/services/email");
// email.send();

const port = process.env.PORT || 3000;
try {
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
} catch (err) {
  console.error("Fatal startup error:", err);
  process.exit(1);
}

const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeRequest = async (res, token) => {
  if (!token) return;

  const hash = jwt.sign(token, process.env.SECRET);
  if (hash !== process.env.TOKEN_HASH) {
    res.status(401);
    return;
  }
};

module.exports = { authorizeRequest };

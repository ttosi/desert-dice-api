const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.send("hello customers");
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", require("./getAll"));
router.get("/categories", require("./getCategories"));
router.get("/category/:category", require("./getByCategory"));
router.get("/category/:category/tags", require("./getTagsByCategory"));
router.get("/tag/:tags", require("./getByTags"));
router.get("/featured", require("./getFeatured"));
router.get("/latest", require("./getLatest"));
router.get("/:id", require("./getById"));
router.get("/isavailable/:id", require("./getAvailability"));
router.patch("/:id", require("./update"));
router.post("/", require("./create"));
router.delete("/", require("./remove"));

module.exports = router;

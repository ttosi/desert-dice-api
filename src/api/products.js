const express = require("express");
const router = express.Router();
const db = require("../database/database");

const productSelectColumns = `SELECT 
    p.id, p.name, p.description, p.coverImage, p.price / 100.0 as basePrice,
    pi.path AS image, p.sold, pi.thumbnail,
    po.id as optionId, po.code, po.description, po.price / 100.0 as optionPrice, po.sold `;

/* GET all available products */
router.get("/", async (req, res) => {
  console.time("query");

  const rows = await db.fetchAll(
    `${productSelectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     LEFT JOIN productOption po ON p.id = po.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL
     )
     ORDER BY p.created ASC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* GET list of active product categories */
router.get("/categories", async (req, res) => {
  const rows = await db.fetchAll(
    `SELECT 
      parent.id AS id,
      parent.name AS categoryName,
      parent.route AS parentRoute,
      child.id AS subcategoryId,
      child.name AS subcategoryName,
      child.route AS subcategoryRoute,
      child.description AS subcategoryDescription,
      child.isActive AS subcategoryIsActive,
      child.sequence AS subcategorySequence
    FROM productGroup parent
    LEFT JOIN productGroup child ON child.parentId = parent.id
    WHERE parent.parentId IS NULL AND parent.isActive = 1
    ORDER BY parent.sequence, child.sequence;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProductGroup(rows));
});

/* GET featured products */
router.get("/featured", async (req, res) => {
  const rows = await db.fetchAll(
    `${productSelectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     LEFT JOIN productOption po ON p.id = po.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE featured = 1 AND sold IS NULL ORDER BY created DESC LIMIT 3
     )
     ORDER BY p.created DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* GET 3 most recent products */
router.get("/latest", async (req, res) => {
  const rows = await db.fetchAll(
    `${productSelectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     LEFT JOIN productOption po ON p.id = po.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL ORDER BY created DESC LIMIT 3
     )
     ORDER BY p.created DESC;`
  );

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* GET products by category slug */
router.get("/category/:category/:subcategory", async (req, res) => {
  const rows = await db.fetchAll(
    `${productSelectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     LEFT JOIN productOption po ON p.id = po.productId
     WHERE p.id IN (
       SELECT p.id FROM product p
       JOIN productCategory pc ON pc.id = p.productCategoryId
       WHERE p.sold IS NULL AND pc.route = ?
     )
     ORDER BY p.created DESC;`,
    [req.params.category]
  );

  console.log(req.params);

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows));
});

/* GET product by ID */
router.get("/:id", async (req, res) => {
  const rows = await db.fetchAll(
    `${productSelectColumns}
     FROM product p
     LEFT JOIN productImage pi ON p.id = pi.productId
     LEFT JOIN productOption po ON p.id = po.productId
     WHERE p.id IN (
       SELECT id FROM product
       WHERE sold IS NULL AND p.id = ?
     )
     ORDER BY p.created, po.id ASC;`,
    [req.params.id]
  );

  console.log("wwwtttfff");

  if (!rows?.length) return res.status(404).end();
  res.json(transformProducts(rows)[0]);
});

router.post("/", async (req, res) => {});

/* Group product rows into structured product objects */
const transformProducts = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          coverImage: row.coverImage,
          price: row.basePrice,
          sold: row.sold,
          created: row.created,
          images: [],
          thumbnails: [],
          options: [],
        };
      }

      if (!acc[row.id].images.includes(row.image) && !row.thumbnail) {
        acc[row.id].images.push(row.image);
      }

      if (!acc[row.id].thumbnails.includes(row.image) && row.thumbnail) {
        acc[row.id].thumbnails.push(row.image);
      }

      if (!acc[row.id].options.find((o) => o.id === row.optionId)) {
        acc[row.id].options.push({
          id: row.optionId,
          code: row.code,
          description: row.description,
          price: row.optionPrice,
          sold: row.sold,
        });
      }

      return acc;
    }, {})
  );
};

const transformProductGroup = (rows) => {
  return Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          name: row.categoryName,
          route: row.parentRoute,
          subcategories: [],
        };
      }

      if (row.subcategoryId) {
        acc[row.id].subcategories.push({
          id: row.subcategoryId,
          name: row.subcategoryName,
          route: row.subcategoryRoute,
          description: row.subcategoryDescription,
          isActive: row.subcategoryIsActive,
        });
      }

      return acc;
    }, {})
  );
};

module.exports = router;

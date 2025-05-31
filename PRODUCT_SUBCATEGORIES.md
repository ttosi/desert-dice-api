## Code from implementing subcategories (tag: subcategories)

#### `api/product.js`

```js
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
```

```js
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
```

```js
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
```

#### `views/ProductView.vue`

```js
<template>
  <section id="shop">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row mt-4">
        <div id="filters" class="w-full md:w-1/4 p-4 hidden md:block">
          <div v-if="currentSubcategories.length > 0" class="mb-6 pb-8 border-b border-gray-line">
            <h3 class="font-[Cinzel] text-desert-dark text-xl mb-3 mt-2 font-bold">Categories</h3>
            <div class="space-y-2">
              <label
                v-for="subcategory in currentSubcategories"
                :key="subcategory.id"
                class="flex items-center">
                <input type="checkbox" class="form-checkbox custom-checkbox" />
                <span class="ml-3 text-lg">{{ subcategory.name }}</span>
              </label>
            </div>
          </div>
          <div>{{ currentCategory }}</div>
        </div>
        <div class="w-full md:w-3/4 p-4">
          <div class="text-desert-dark text-3xl font-bold font-[Cinzel] mt-1 mb-2">
            {{ currentCategory?.name }}
          </div>
          <div v-if="products" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="bg-white p-4 rounded-lg shadow shadow-slate-400">
              <RouterLink :to="`/product/${product.id}`">
                <img
                  :src="`${imageBaseUrl}/${product.coverImage}`"
                  class="w-full object-cover mb-4 rounded-lg" />
              </RouterLink>
              <div class="text-lg font-semibold">{{ product.name }}</div>
              <div class="flex items-center mb-4">
                <span class="text-lg text-primary">${{ product?.price.toFixed(2) }}</span>
              </div>
              <RouterLink :to="`/product/${product.id}`">
                <button type="button" class="button-primary">View Details</button>
              </RouterLink>
            </div>
          </div>
          <div v-else>
            <div class="mb-4">There are currently no items in this category</div>
            <button type="button" class="button-primary">Notify Me</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productStore';

const imageBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;
const route = useRoute();

const productStore = useProductStore();
const { products, categories } = storeToRefs(productStore);
const { getProductsByCategory } = productStore;

const currentCategory = computed(() => {
  return categories.value.find((c) => c.route === route.params.category);
});

const currentSubcategories = computed(() => {
  return categories.value.find((c) => c.route === route.params.category).subcategories;
});

watchEffect(async () => {
  await getProductsByCategory(route.params.category);
});
</script>

<style lang="scss" scoped></style>
```

#### database

```sql
CREATE TABLE "productSubcategory" (
	"id"	INTEGER NOT NULL,
	"productCategoryId"	INTEGER,
	"route"	TEXT,
	"name"	TEXT,
	"description"	TEXT,
	"sequence"	INTEGER,
	"isActive"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
)

INSERT INTO "main"."productSubcategory" ("id", "productCategoryId", "route", "name", "description", "sequence", "isActive") VALUES (1, 1, 'all', 'All Dice Products', 'Each die we make is handcrafted with care, character, and a touch of unpredictability. Whether you''re battling dragons, telling stories, or building your hoard, these resin creations are made to stand out at the table. Expect rich color, thoughtful design, and a bit of personality in every roll. No two are exactly alike — and that''s exactly the point.', 1, 1);
INSERT INTO "main"."productSubcategory" ("id", "productCategoryId", "route", "name", "description", "sequence", "isActive") VALUES (2, 1, 'dicesets', 'Full Dice Sets', 'Complete polyhedral sets crafted for adventurers, collectors, and tabletop legends. Each set includes all the essentials for your next campaign: d4 through d20. Made with care and creativity, these dice are designed to stand out. Perfect for character builds, spellcasters, or that one player who always rolls nat 1s. Pick a set that rolls with your story.', 2, 1);
INSERT INTO "main"."productSubcategory" ("id", "productCategoryId", "route", "name", "description", "sequence", "isActive") VALUES (3, 1, 'chonkers', 'd20 Chonkers', 'Big, bold, and impossible to ignore — our Chonkers are 33mm d20s with serious presence. Perfect as statement pieces or rolling intimidation checks IRL. These oversized dice are handmade with the same detail as our full sets. Whether you use them for dramatic rolls or as altar-worthy decor, they hit different. Warning: table-shaking may occur.', 3, 1);
INSERT INTO "main"."productSubcategory" ("id", "productCategoryId", "route", "name", "description", "sequence", "isActive") VALUES (4, 1, 'misfits', 'Misfits', 'Not all dice roll out perfect, but these still have charm. The Misfits category includes dice with minor cosmetic flaws — surface specks, bubbles, or off-center numbers. They’re fully functional and full of character. Great for casual gaming, backups, or your chaotic cousin who always “borrows” your favorite d20. Think of them as battle-scarred veterans at a humble price.', 4, 1);
INSERT INTO "main"."productSubcategory" ("id", "productCategoryId", "route", "name", "description", "sequence", "isActive") VALUES (5, 1, 'sale', 'Diceyard Sale', 'A rotating collection of experimental runs, first drafts, and oddballs from the workshop. These dice are unique, limited, and deeply discounted. You might find an early prototype, a one-off swirl, or a color combo that never made the main lineup. It’s a grab bag for the curious and the bold. Once they’re gone, they’re gone for good.', 5, 1);

CREATE TABLE "productGroup" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "parentId" INTEGER, -- NULL for top-level categories, set for subcategories
  "route" TEXT,
  "name" TEXT,
  "description" TEXT,
  "isActive" INTEGER,
  "sequence" INTEGER,
  FOREIGN KEY ("parentId") REFERENCES productGroup("id")
)

INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (1, NULL, 'dice', 'Dice', '', 1, 1);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (2, NULL, 'dicecases', 'Dice Cases', '', 1, 3);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (3, NULL, 'jewelry', 'Jewelry', '', 1, 4);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (4, NULL, 'molds', 'Molds', '', 0, 6);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (5, NULL, 'masters', 'Masters', '', 0, 5);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (6, NULL, 'collections', 'Collections', '', 0, 2);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (7, 1, 'all', 'All Dice Products', 'Each die we make is handcrafted with care, character, and a touch of unpredictability. Whether you''re battling dragons, telling stories, or building your hoard, these resin creations are made to stand out at the table. Expect rich color, thoughtful design, and a bit of personality in every roll. No two are exactly alike — and that''s exactly the point.', 1, 1);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (8, 1, 'dicesets', 'Full Dice Sets', 'Complete polyhedral sets crafted for adventurers, collectors, and tabletop legends. Each set includes all the essentials for your next campaign: d4 through d20. Made with care and creativity, these dice are designed to stand out. Perfect for character builds, spellcasters, or that one player who always rolls nat 1s. Pick a set that rolls with your story.', 1, 2);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (9, 1, 'chonkers', 'd20 Chonkers', 'Big, bold, and impossible to ignore — our Chonkers are 33mm d20s with serious presence. Perfect as statement pieces or rolling intimidation checks IRL. These oversized dice are handmade with the same detail as our full sets. Whether you use them for dramatic rolls or as altar-worthy decor, they hit different. Warning: table-shaking may occur.', 1, 3);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (10, 1, 'misfits', 'Misfits', 'Not all dice roll out perfect, but these still have charm. The Misfits category includes dice with minor cosmetic flaws — surface specks, bubbles, or off-center numbers. They’re fully functional and full of character. Great for casual gaming, backups, or your chaotic cousin who always “borrows” your favorite d20. Think of them as battle-scarred veterans at a humble price.', 1, 4);
INSERT INTO "main"."productGroup" ("id", "parentId", "route", "name", "description", "isActive", "sequence") VALUES (11, 1, 'sale', 'Diceyard Sale', 'A rotating collection of experimental runs, first drafts, and oddballs from the workshop. These dice are unique, limited, and deeply discounted. You might find an early prototype, a one-off swirl, or a color combo that never made the main lineup. It’s a grab bag for the curious and the bold. Once they’re gone, they’re gone for good.', 1, 5);
```

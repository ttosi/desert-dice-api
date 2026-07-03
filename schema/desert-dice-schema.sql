BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "customer" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"address1"	TEXT,
	"address2"	TEXT,
	"city"	TEXT,
	"state"	TEXT,
	"zip"	TEXT,
	"created_at"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "customer_order" (
	"id"	INTEGER NOT NULL,
	"customer_id"	INTEGER NOT NULL,
	"option_id"	INTEGER,
	"order_number"	INTEGER,
	"shipped_at"	TEXT,
	"created_at"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("customer_id") REFERENCES "customer"("id"),
	FOREIGN KEY("option_id") REFERENCES "product_option"("id")
);
CREATE TABLE IF NOT EXISTS "notify" (
	"id"	INTEGER NOT NULL,
	"category_id"	INTEGER,
	"email"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "product" (
	"id"	INTEGER NOT NULL UNIQUE,
	"category_id"	INTEGER NOT NULL,
	"collection_id"	INTEGER,
	"related_product_id"	INTEGER,
	"name"	TEXT,
	"description"	TEXT,
	"cover_image_path"	TEXT,
	"cover_price"	INTEGER,
	"is_featured"	INTEGER DEFAULT 0,
	"is_unique"	INTEGER DEFAULT 0,
	"stock"	INTEGER DEFAULT 1,
	"is_sold"	INTEGER DEFAULT 0,
	"reserved_at"	TEXT,
	"created_at"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("category_id") REFERENCES "product_category"("id"),
	FOREIGN KEY("collection_id") REFERENCES "product_collection"("id")
);
CREATE TABLE IF NOT EXISTS "product_category" (
	"id"	INTEGER NOT NULL,
	"code"	TEXT,
	"name"	TEXT,
	"route"	TEXT,
	"description"	TEXT,
	"is_active"	INTEGER DEFAULT 0,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "product_collection" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"description"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "product_image" (
	"id"	INTEGER NOT NULL UNIQUE,
	"product_id"	INTEGER NOT NULL,
	"path"	TEXT,
	"is_thumbnail"	INTEGER DEFAULT 0,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("product_id") REFERENCES "product"("id")
);
CREATE TABLE IF NOT EXISTS "product_option" (
	"id"	INTEGER NOT NULL,
	"product_id"	INTEGER,
	"name"	TEXT,
	"price"	INTEGER,
	"notes"	TEXT,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("product_id") REFERENCES "product"("id")
);
CREATE TABLE IF NOT EXISTS "product_option_item" (
	"id"	INTEGER NOT NULL,
	"option_id"	INTEGER NOT NULL,
	"product_id"	INTEGER NOT NULL,
	"quantity"	INTEGER DEFAULT 1,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("option_id") REFERENCES "product_option"("id"),
	FOREIGN KEY("product_id") REFERENCES "product"("id")
);
CREATE TABLE IF NOT EXISTS "product_tag" (
	"id"	INTEGER NOT NULL,
	"code"	TEXT NOT NULL,
	"name"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "product_tag_map" (
	"product_id"	INTEGER NOT NULL,
	"tag_id"	INTEGER NOT NULL,
	PRIMARY KEY("product_id","tag_id"),
	FOREIGN KEY("product_id") REFERENCES "product"("id"),
	FOREIGN KEY("tag_id") REFERENCES "product_tag"("id")
);
CREATE TABLE IF NOT EXISTS "promo_code" (
	"id"	INTEGER NOT NULL,
	"referral_id"	INTEGER,
	"code"	TEXT,
	"discount"	INTEGER COLLATE NOCASE,
	"min_purchase"	INTEGER,
	"redeemed_at"	TEXT,
	"created_at"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("referral_id") REFERENCES "referral"("id")
);
CREATE TABLE IF NOT EXISTS "referral" (
	"id"	INTEGER NOT NULL,
	"customer_id"	INTEGER,
	"code"	TEXT,
	"discount"	INTEGER,
	"used_at"	TEXT,
	"created_at"	TEXT DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("customer_id") REFERENCES "customer"("id")
);
CREATE TABLE IF NOT EXISTS "social" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"url"	TEXT,
	"logo_path"	TEXT,
	"is_active"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;

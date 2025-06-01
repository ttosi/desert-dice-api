BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "customer" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"firstName"	TEXT,
	"lastName"	TEXT,
	"created"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "customerAddress" (
	"id"	INTEGER NOT NULL,
	"customerId"	INTEGER NOT NULL,
	"address1"	TEXT,
	"address2"	TEXT,
	"city"	TEXT,
	"state"	TEXT,
	"zip"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("customerId") REFERENCES "customer"("id")
);
CREATE TABLE IF NOT EXISTS "customerOrder" (
	"id"	INTEGER NOT NULL,
	"customerId"	INTEGER NOT NULL,
	"orderNumber"	INTEGER,
	"productOptionId"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("customerId") REFERENCES "customer"("id"),
	FOREIGN KEY("productOptionId") REFERENCES "productOption"("id")
);
CREATE TABLE IF NOT EXISTS "product" (
	"id"	INTEGER NOT NULL UNIQUE,
	"productCategoryId"	NUMERIC NOT NULL,
	"name"	TEXT,
	"description"	TEXT,
	"coverImagePath"	TEXT,
	"coverPrice"	INTEGER,
	"isFeatured"	INTEGER,
	"isSold"	INTEGER,
	"created"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("productCategoryId") REFERENCES "productCategory"("id")
);
CREATE TABLE IF NOT EXISTS "productCategory" (
	"id"	INTEGER NOT NULL,
	"route"	TEXT,
	"name"	TEXT,
	"description"	TEXT,
	"isActive"	INTEGER,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "productImage" (
	"id"	INTEGER NOT NULL UNIQUE,
	"productId"	INTEGER NOT NULL,
	"productOptionId"	INTEGER,
	"path"	TEXT,
	"isThumbnail"	INTEGER,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("productOptionId") REFERENCES "productOption"("id")
);
CREATE TABLE IF NOT EXISTS "productOption" (
	"id"	INTEGER NOT NULL,
	"productId"	INTEGER,
	"name"	TEXT,
	"price"	INTEGER,
	"notes"	TEXT,
	"hasChonk"	INTEGER,
	"isSold"	INTEGER,
	"sequence"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("productId") REFERENCES "product"("id")
);
CREATE TABLE IF NOT EXISTS "productOption_productType" (
	"productOptionId"	INTEGER NOT NULL,
	"productTypeId"	INTEGER NOT NULL,
	PRIMARY KEY("productOptionId","productTypeId"),
	FOREIGN KEY("productOptionId") REFERENCES "productOption"("id"),
	FOREIGN KEY("productTypeId") REFERENCES "productType"("id")
);
CREATE TABLE IF NOT EXISTS "productType" (
	"id"	INTEGER NOT NULL,
	"code"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;

BEGIN TRANSACTION;
INSERT INTO "productCategory" ("id","route","name","description","isActive","sequence") VALUES (1,'dice','Dice','These are the heart of the whole operation. Our handcrafted resin dice, made one at a time with lots of love and just a bit of chaos. Perfect for rolling nat 20s, starting conversations, or just admiring under the right light. No two are exactly alike, and that’s kind of the point.',1,1),
 (2,'dicecases','Dice Cases','Somewhere cool to keep your shiny math rocks. These are handmade resin cases, built to hold dice (and secrets, if needed). Tough, pretty, and satisfying to open — kind of like a tiny treasure chest for your rolls.',1,3),
 (3,'jewelry','Jewelry','Necklaces and earrings made with the same resin, pigments, and style as our sets. Great for gifting or just leveling up your own vibe. Subtle enough to wear out, bold enough to get noticed.',1,4),
 (4,'molds','Molds',NULL,0,6),
 (5,'masters','Masters',NULL,0,5),
 (6,'collections','Collections',NULL,0,2);
COMMIT;

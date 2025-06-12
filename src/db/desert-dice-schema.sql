SELECT 
        p.id, p.name AS productName, p.description, p.cover_image_path,
        p.cover_price / 100, p.created_at, po.id AS productOptionId,
        po.name AS productOptionName, po.price / 100 AS optionPrice, po.notes,
        pi.id as productImageId, pi.path, pi.is_thumbnail
     FROM product p
     LEFT JOIN product_option po ON p.id = po.product_id
     LEFT JOIN product_image pi ON p.id = pi.product_id
     WHERE p.id = 1
     ORDER BY po.sequence, pi.sequence;
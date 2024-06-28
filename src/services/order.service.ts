import pool from "../db/postgre";
import { HttpException } from "../exceptions/HttpException";

export async function addTheOrder(
  productid: string,
  count: number,
  userid: number
): Promise<any> {
  if (!productid || !count || !userid) {
    throw new HttpException(404, "somethind missing");
  }
  await pool.query(`
        CREATE TABLE IF NOT EXISTS order10 (
            id SERIAL PRIMARY KEY,
             productid INTEGER REFERENCES products10(id),
             count INT,
             userid INTEGER REFERENCES users10(id),
             total INT
        )
        `);
  //............
  const existingRecordResult = await pool.query(
    "SELECT * FROM order10 WHERE (userid,productid) = ($1, $2)",
    [userid, productid]
  );
  if (existingRecordResult.rows.length > 0) {
    throw new HttpException(400, "order already exists on this user");
  } else {
    //..............
    //   const foundProduct.rows[0].countl.query('SELECT count FROM products10 WHERE id = $1', [productid]);
    //   const productPriceResult = await pool.query('SELECT price FROM products10 WHERE id = $1', [productid]);

    const foundProduct = await pool.query(
      "SELECT * FROM products10 WHERE id = $1",
      [productid]
    );

    // // const foundProduct = existingRecordResult:existingRecordResult.rows[0].price

    if (!foundProduct.rows[0].count) {
      throw new HttpException(404, "Product price not found");
    }

    const productCount = parseInt(foundProduct.rows[0].count);
    const productprice = parseInt(foundProduct.rows[0].price);

    // Check if count is less than 10
    if (count > productCount) {
      throw new HttpException(
        400,
        `Product count (${count}) is more than actual count ${productCount}`
      );
    } else {
      const newCount = productCount - count;

      await pool.query("UPDATE products10 SET count = $1 WHERE id = $2", [
        newCount,
        productid,
      ]);
    }
    //   //..............
    const total = productprice * count;
    const insertResult = await pool.query(
      "INSERT INTO order10 (productid, count, userid, total) VALUES ($1, $2, $3, $4) RETURNING *;",
      [productid, count, userid, total]
    );
    console.log(insertResult);
    return insertResult;
  }
}

export async function getTheOrder(id: string, role: string): Promise<any> {
  //         const query = `
  //                         SELECT
  //                             o.id AS order_id,
  //                             p.id AS product_id,
  //                             p.productName,
  //                             p.price,
  //                             p.count AS product_count,
  //                             p.brand,
  //                             o.count AS order_count,
  //                             o.total
  //                         FROM
  //                             order10 o
  //                         INNER JOIN
  //                             products10 p ON o.productid = p.id
  //                         INNER JOIN
  //                             users10 u ON o.userid = u.id
  //                         WHERE
  //                             o.userid = $1
  //                     `;
  //         const { rows } = await pool.query(query,[parseInt(id)]);
  //        const product_ids =  rows.map((id)=>id.product_id)
  //        console.log(product_ids)
  // // const prodimages = await pool.query(imagequery);

  // // const product_ids = [1,2]
  // // const placeholders = product_ids.map((id, index) => `$${index + 1}`).join(', ');

  // // const queryText = `
  // //   SELECT p.id, pi.productImages
  // //   FROM products10 p
  // //   INNER JOIN product_images pi ON p.id = pi.product_id
  // //   WHERE p.id IN (${placeholders})
  // //   ORDER BY pi.id DESC;
  // // `;
  // const placeholders = product_ids.map((id, index) => `$${index + 1}`).join(', ');

  // const queryText = `
  // WITH RankedImages AS (
  // SELECT p.id, pi.productImages, pi.id AS image_id,
  // ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY pi.id DESC) AS rn
  // FROM products10 p
  // INNER JOIN product_images pi ON p.id = pi.product_id
  // WHERE p.id IN (${placeholders})
  // )
  // SELECT id, productImages
  // FROM RankedImages
  // WHERE rn = 1;
  // `;

  // // Construct the query object with values
  // const imgquery = {
  // text: queryText,
  // values: product_ids,
  // };

  // // Execute the query
  // const prodimages = await pool.query(imgquery)

  // console.log("rowwwws",prodimages.rows)

  //         if (rows.length === 0) {
  //             throw new HttpException(404,'No orders found for this user' );
  //         }

  // console.log("proddddddd",prodimages)
  // //..............
  // const imageMap:any = {};
  // prodimages.rows.forEach(image => {
  // const { id, productimages } = image;
  // if (!imageMap[id]) {
  // imageMap[id] = [];
  // }
  // imageMap[id].push(productimages);
  // });

  // // Merge images into rows based on product_id
  // const mergedData = rows.map(row => ({
  // ...row,
  // images: imageMap[row.product_id] || [] // Assign empty array if no images found
  // }));

  // console.log(mergedData);
  // //..............

  //             // rows:rows,img:prodimages.rows,
  //             return {result:mergedData };

  //..................................................................................................
  console.log(id, "lllll");
  // const query = `
  // SELECT
  //     o.id AS order_id,
  //     p.id AS product_id,
  //     p.productName,
  //     p.price,
  //     p.count AS product_count,
  //     p.brand,
  //     o.count AS order_count,
  //     o.total
  // FROM
  //     order10 o
  // INNER JOIN
  //     products10 p ON o.productid = p.id
  // INNER JOIN
  //     users10 u ON o.userid = u.id
  // WHERE
  //     o
  // `;
  //.........
  // let role = 'user'
  const query = `
SELECT 
    o.id AS order_id, 
    p.id AS product_id, 
    p.productName, 
    p.price, 
    p.count AS product_count,  
    p.brand, 
    o.count AS order_count,
    o.total,
    o.userid
FROM 
    order10 o
INNER JOIN 
    products10 p ON o.productid = p.id
INNER JOIN 
    users10 u ON o.userid = u.id
    ${
      role === "user"
        ? `WHERE
        o.userid = $1`
        : ""
    }
`;

  const { rows } =
    role === "user" ? await pool.query(query, [4]) : await pool.query(query);
  const product_ids = rows.map((id) => id.product_id);
  console.log(product_ids);
  // const prodimages = await pool.query(imagequery);

  // const product_ids = [1,2]
  const placeholders = product_ids
    .map((id, index) => `$${index + 1}`)
    .join(", ");

  const queryText = `
SELECT p.id, pi.productImages, pi.id
FROM products10 p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id IN (${placeholders});
`;

  // Construct the query object with values
  const imgquery = {
    text: queryText,
    values: product_ids,
  };

  // Execute the query
  const prodimages = await pool.query(imgquery);

  console.log("rowwwws", prodimages);

  // if (rows.length === 0) {
  // return res.status(404).send({ message: 'No orders found for this user' });
  // }

  //..............
  const imageMap: any = {};
  prodimages.rows.forEach((image: any) => {
    const { id, productimages, imgid } = image;
    if (!imageMap[id]) {
      imageMap[id] = [];
    }
    imageMap[id].push(productimages);
  });

  // Merge images into rows based on product_id
  const mergedData = rows.map((row) => ({
    ...row,
    images: imageMap[row.product_id] || [], // Assign empty array if no images found
  }));

  console.log(mergedData);
  //..............

  // rows:rows,img:prodimages.rows,
  return { result: mergedData };
}

export async function updateTheOrder(id: number, count: number): Promise<any> {
  const existingRecordResult = await pool.query(
    "SELECT * FROM order10 WHERE id = $1",
    [id]
  );
  if (existingRecordResult.rows.length === 0) {
    throw new HttpException(404, "order item not found");
  }
  //.............

  const foundProduct = await pool.query(
    "SELECT * FROM products10 WHERE id = $1",
    [id]
  );

  if (!foundProduct.rows[0].count) {
    throw new HttpException(404, "Product not found");
  }

  const productCount = parseInt(foundProduct.rows[0].count);
  const productPrice = parseInt(foundProduct.rows[0].price);

  if (count > productCount) {
    throw new HttpException(
      400,
      `Product count (${count}) is more than actual count ${productCount}`
    );
  } else {
    const newCount = productCount - count;
    await pool.query("UPDATE products10 SET count = $1 WHERE id = $2", [
      newCount,
      id,
    ]);
  }

  const total = productPrice * count;
  const updateResult = await pool.query(
    "UPDATE order10 SET count = $1, total = $2 WHERE id = $3 RETURNING *",
    [count, total, id]
  );
  console.log(updateResult.rows[0]);

  return {
    message: "Cart item updated successfully",
    updatedCartItem: updateResult.rows[0],
  };
}

export async function deleteTheOrder(id: string): Promise<any> {
  const existingRecordResult = await pool.query(
    "SELECT * FROM order10 WHERE id = $1",
    [parseInt(id)]
  );
  if (existingRecordResult.rows.length === 0) {
    throw new HttpException(404, "order item not found");
  }
  await pool.query("DELETE FROM order10 WHERE id = $1", [id]);

  return { message: "order item deleted successfully" };
}

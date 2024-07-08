import pool from "../db/postgre";
import { HttpException } from "../exceptions/HttpException";
import path from "path";
import fs from "fs";

export async function addTheProduct(
  productName: string,
  price: string,
  count: string,
  category: string,
  brand: string,
  productImages: string[],
  ss: any
): Promise<any> {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS products10 (
        id SERIAL PRIMARY KEY,
        productName VARCHAR(12),
        price INT,
        count INT,
        category VARCHAR(12),
        brand VARCHAR(12),
        productaddon JSONB[],
        productvariants JSONB[]
        )
        `);
  await pool.query(`
         CREATE TABLE IF NOT EXISTS product_images (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products10(id),
          productImages TEXT
      )
          `);
  //   await pool.query(`
  //     CREATE TABLE IF NOT EXISTS productconfiguration (
  //      id SERIAL PRIMARY KEY,
  //      product_id INTEGER REFERENCES products10(id),
  //      productImages TEXT
  //  )
  //      `);
  //      await pool.query(`CREATE TABLE IF NOT EXISTS productconfiguration_images (
  //      id SERIAL PRIMARY KEY,
  //      productconfiguration_id INTEGER REFERENCES productconfiguration(id),
  //      p
  //      productImages TEXT
  //  )`)
  const existingProductQuery =
    "SELECT * FROM products10 WHERE productName = $1";
  const existingProductResult = await pool.query(existingProductQuery, [
    productName,
  ]);

  if (existingProductResult.rows.length > 0) {
    throw new HttpException(400, "The product already exists");
  } else {
    const priceNum = parseFloat(price);
    const countNum = parseInt(count, 10);
    const insertQuery = `
          INSERT INTO products10 (productName, price, count, category, brand, productaddon, productvariants)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`;
    const values = [
      productName,
      priceNum,
      countNum,
      category,
      brand,
      // {ll:[{...ss.productinfo}]},{ll:[{...ss.variants}]}
      ss.productinfo,
      ss.variants,
    ];
    const result = await pool.query(insertQuery, values);
    const productId = result.rows[0].id;
    const insertImageQuery = `
  INSERT INTO product_images (product_id, productImages)
  VALUES ($1, $2)`;
  
    for (let i = 0; i < productImages.length; i++) {
      await pool.query(insertImageQuery, [productId, productImages[i]]);
    }
    console.log(result.rows[0]);
    return { result: result.rows[0] };
  }
}

export async function getAllTheProducts(
  pageNumber: number,
  pageSize: number
): Promise<any> {
  const offset = (pageNumber - 1) * pageSize;
  const qery = `SELECT
    p.id,
    p.productName,
    p.price,
    p.count,
    p.category,
    p.brand,
    ARRAY_AGG(pi.productImages ORDER BY pi.id) AS product_images
FROM
    products10 p
JOIN
    product_images pi ON p.id = pi.product_id
GROUP BY
    p.id, p.productName, p.price, p.count, p.category, p.brand
ORDER BY
    p.id
    LIMIT $1
    OFFSET $2`;
  const productsData = (await pool.query(qery, [pageSize, offset])).rows;
  console.log("before appernd", productsData);
  const baseUrl = "http://localhost:3000/";

  const modifiedData = productsData.map((item) => ({
    ...item,
    product_images: item.product_images.map((image: string) => baseUrl + image),
  }));

  console.log("after append", modifiedData);
  return modifiedData;
}
export async function deleteTheProduct(id: string): Promise<any> {
  const productQuery = "SELECT * FROM products10 WHERE id = $1";
  const product = await pool.query(productQuery, [id]);

  if (product.rows.length === 0) {
    throw new HttpException(404, "Product not found");
  }
  const selectQuery = {
    text: "SELECT productImages FROM product_images WHERE product_id = $1",
    values: [id],
  };
  const result = await pool.query(selectQuery);
  const imageNamesToDelete = result.rows.map((row) => row.productimages);
  console.log("imagenames", imageNamesToDelete);
  imageNamesToDelete.forEach((imageName: string) => {
    const imagePathToDelete = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      imageName
    );
    console.log("kkkkkkkk", __dirname, imageName);
    fs.unlink(imagePathToDelete, (err) => {
      if (err) {
        console.error(`Error deleting image ${imageName}: ${err}`);
        return;
      }
      console.log(`Image ${imageName} deleted successfully`);
    });
  });
  const deleteimageQuery = {
    text: "DELETE FROM product_images WHERE product_id = $1",
    values: [id],
  };
  const deleteImageresult = await pool.query(deleteimageQuery);
  console.log(`Deleted product images for product_id ${id}`);

  // const productimagesdeleteresult =  result.rowCount; // Return the number of rows deleted
  const deleteQuery = "DELETE FROM products10 WHERE id = $1";
  console.log(id, "lasttt");
  const deleteResult = await pool.query(deleteQuery, [id]);
  console.log(deleteResult.rows);
  return deleteResult.rows;
}

export async function updateTheProduct(
  id: number,
  newImageFile: string[],
  productName: string,
  price: number,
  count: number,
  category: string,
  brand: string,
  imageId: number[],
  oldImageName: string[]
): Promise<any> {
  let updateValues = [];
  let updateFields = [];
  {
    if (productName) {
      updateValues.push(productName);
      updateFields.push("productName");
    }
    if (price) {
      updateValues.push(price);
      updateFields.push("price");
    }
    if (count) {
      updateValues.push(count);
      updateFields.push("count");
    }
    if (brand) {
      updateValues.push(brand);
      updateFields.push("brand");
    }
    if (category) {
      updateValues.push(category);
      updateFields.push("category");
    }
    console.log("bind", updateValues);
    // Construct the update query dynamically based on available fields
    const updateQuery = `
        UPDATE products10
        SET ${updateFields
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")}
        WHERE id = $${updateValues.length + 1}
    `;
    console.log(updateQuery);
    updateValues.push(id);
    console.log(updateValues, "valll");
    const updateResult = await pool.query(updateQuery, updateValues);
    console.log(updateResult);
  }
  //...............................................................
  if (imageId && oldImageName && newImageFile) {
    const updateQuery = `
      UPDATE product_images
      SET productImages = $1
      WHERE id = $2
      RETURNING *;
    `;
    for (let i = 0; i < newImageFile.length; i++) {
      const values = [newImageFile[i], imageId[i]];
      await pool.query(updateQuery, values);
    }
    // result.rows[0]; // Return the updated row
    oldImageName.forEach((imageName: string) => {
      const imagePathToDelete = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        imageName
      );
      console.log("kkkkkkkk", __dirname, imageName);
      fs.unlink(imagePathToDelete, (err) => {
        if (err) {
          console.error(`Error deleting image ${imageName}: ${err}`);
          return;
        }
        console.log(`Image ${imageName} deleted successfully`);
      });
    });
  } else {
    throw new HttpException(404, "something missing");
  }
}
// export async function getAllTheProducts(pageNumber:number,pageSize:number):Promise<any>{

// }

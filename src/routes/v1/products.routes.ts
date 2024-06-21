import Express, { Request,Response, query } from "express";
import multer from 'multer'
import pool from "../../db/postgre";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    // cb(null, file.originalname);
    },
  });
const upload = multer({ storage: storage })

const products = Express();

products.post('/addProduct',upload.array('productImages', 5), async (request, res) => {

const  { productName,price,count,category,brand} = request.body
const productImages:string[] = (request.files as any[])?.map((file: any) => file.filename);
  try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products10 (
        id SERIAL PRIMARY KEY,
        productName VARCHAR(12),
        price VARCHAR(12),
        count VARCHAR(12),
        category VARCHAR(12),
        brand VARCHAR(12)
        )
        `); 
        await pool.query(`
         CREATE TABLE IF NOT EXISTS product_images (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products10(id),
          productImages TEXT
      )
          `); 
      const existingProductQuery = 'SELECT * FROM products10 WHERE productName = $1';
      const existingProductResult = await pool.query(existingProductQuery, [productName]);

      if (existingProductResult.rows.length > 0) {
          throw new Error('The product already exists');
      }

      const priceNum = parseFloat(price);
      const countNum = parseInt(count, 10);

      const insertQuery = `
          INSERT INTO products10 (productName, price, count, category, brand)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`;
        
      const values = [productName, priceNum, countNum, category, brand];
      const result = await pool.query(insertQuery, values);
      const productId = result.rows[0].id;

      const insertImageQuery = `
  INSERT INTO product_images (product_id, productImages)
  VALUES ($1, $2)`;

  for (let i = 0; i < productImages.length; i++) {
    await pool.query(insertImageQuery, [productId, productImages[i]]);
}
  await pool.query('COMMIT');
  console.log(result.rows[0])
  return result.rows[0]; 
  }  catch (error) {
    console.error('Internal server error', error);
    res.status(500).send({ Message: 'Internal Server Error' });
    }
    })

    products.get('/getAllProducts', async (request, res) => {
//if its req.query then they ask for type becaus either we didnt mention the quwery parse or 
const {pageNumber,pageSize} = request.body
const offset = (pageNumber - 1) * pageSize;
        try {

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
  const productsData = (await pool.query(qery,[pageSize,offset])).rows
  console.log("before appernd",productsData)
  const baseUrl = 'http://localhost:3000/';
  
  const modifiedData = productsData.map(item => ({
    ...item,
    product_images: item.product_images.map((image: string) => baseUrl + image)
  }));
  
  console.log("after append",modifiedData);
  return modifiedData
        }  catch (error) {
          console.error('Internal server error', error);
          res.status(500).send({ Message: 'Internal Server Error' });
          }
          })

products.get('/loginwithotptt', async (request, res) => {
  try {

  } catch (error) {
  console.error('Internal server error', error);
  res.status(500).send({ Message: 'Internal Server Error' });
  }
  });
       
export default products


















// const data = [
//   {
//     PRIMARYid:"",
//     productName:"",
//     price:"",
//     count:"",
//     category:"",
//     brand:"",
//     productimages:[{
//       imageprimaryid:"",
//       productimage:''
//     },
//     {
//       imageprimaryid:"",
//       productimage:''
//     },
//     {
//       imageprimaryid:"",
//       productimage:''
//     }
//     ]
//   }
// ]





//......................................................reserved........................
// products.get('/getAllProducts', async (request, res) => {

//   //  const { skip, limit } = request.body; // Assuming skip and limit are provided in the request query
// //if its req.query then they ask for type becaus either we didnt mention the quwery parse or 
// // Convert skip and limit to integers (ensure they are properly sanitized and validated)
// // const parsedSkip = parseInt(skip, 10) || 0;
// // const parsedLimit = parseInt(limit, 10) || 10; // Default limit of 10 if not provided

//     try {
//   //     const query2 = `
//   //     SELECT *
//   //     FROM products10
//       // OFFSET $1
//       // LIMIT $2`;

//   // const values = [parsedSkip, parsedLimit];
//   // const result2 = await pool.query(query2, values);
//   //................................................
//   const query = `
//   SELECT 
//     p.id AS product_id,
//     p.productName,
//     p.price,
//     p.count,
//     p.category,
//     p.brand,
//     pi.id AS image_primary_id,
//     pi.productImages
//   FROM products10 p
//   LEFT JOIN product_images pi ON p.id = pi.product_id
// `;
// // Execute the query using node-postgres
// const { rows } = await pool.query(query);
// console.log("joinnnn",rows)
// //......
// const formatData = (rows: any[]) => {
// const formattedData:any = [];
// let currentProduct: { product_id: any; productimages: any; productName?: any; price?: any; count?: any; category?: any; brand?: any; } | null = null;

// rows.forEach(row => {
// // Check if this row is for a new product
// if (!currentProduct || currentProduct.product_id !== row.product_id) {
//   // If yes, push the previous product (if exists) into formattedData
//   if (currentProduct) {
//     formattedData.push(currentProduct);
//   }
//   // Initialize a new product object
//   currentProduct = {
//     product_id: row.product_id,
//     productName: row.productname, // Note: Column name should match exactly case-wise
//     price: row.price,
//     count: row.count,
//     category: row.category,
//     brand: row.brand,
//     productimages: []
//   };
// }

// // Add image information if exists
// if (row.image_primary_id && row.productimages) {
//   currentProduct.productimages.push({
//     image_primary_id: row.image_primary_id,
//     productimage: row.productimages
//   });
// }
// });

// // Push the last product into formattedData
// if (currentProduct) {
// formattedData.push(currentProduct);
// }

// return formattedData;
// };

// // Format the rows into the desired structure
// const formattedData = formatData(rows);
// // console.log(formattedData);
// console.log(JSON.stringify(formattedData, null, 2));


 


//   //................................................

//     }  catch (error) {
//       console.error('Internal server error', error);
//       res.status(500).send({ Message: 'Internal Server Error' });
//       }
//       })


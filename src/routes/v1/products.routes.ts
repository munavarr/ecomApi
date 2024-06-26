import Express, { Request,Response, query } from "express";
import multer from 'multer'
import pool from "../../db/postgre";
import path from 'path'
import fs from 'fs'


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
  res.status(500).send({result : result.rows[0]  }); 
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
       



products.post('/deleteSingleProduct', async (request, res) => {
  const id = request.body.id
    try {
      const productQuery = 'SELECT * FROM products10 WHERE id = $1';
      const product = await pool.query(productQuery, [id]);
    
      if (product.rows.length === 0) {
          throw new Error('Product not found');
      }
      const selectQuery = {
        text: 'SELECT productImages FROM product_images WHERE product_id = $1',
        values: [id],
      };
      const result = await pool.query(selectQuery);
      const imageNamesToDelete = result.rows.map(row => row.productimages);
      console.log("imagenames",imageNamesToDelete)
      imageNamesToDelete.forEach((imageName:string) => {
        const imagePathToDelete = path.join(__dirname,'..', '..', '..', 'uploads', imageName);
      console.log("kkkkkkkk",__dirname,imageName)
        fs.unlink(imagePathToDelete, (err) => {
            if (err) {
                console.error(`Error deleting image ${imageName}: ${err}`);
                return;
            }
            console.log(`Image ${imageName} deleted successfully`);
        });
      });
      const deleteimageQuery = {
        text: 'DELETE FROM product_images WHERE product_id = $1',
        values: [id],
      };
      const deleteImageresult = await pool.query(deleteimageQuery);
      console.log(`Deleted product images for product_id ${id}`);
    
      // const productimagesdeleteresult =  result.rowCount; // Return the number of rows deleted
      const deleteQuery = 'DELETE FROM products10 WHERE id = $1';
      console.log(id,"lasttt")
      const deleteResult = await pool.query(deleteQuery, [id]);
      console.log(deleteResult)
      return deleteResult
    }  catch (error) {
      console.error('Internal server error', error);
      res.status(500).send({ Message: 'Internal Server Error' });
      }
      })

products.post('/update-product/:id',upload.array('newImageFile',5), async (request, res) => {
  const id = parseInt(request.params.id);
  // const newImageFile = request.files;
  const newImageFile:string[] = (request.files as any[])?.map((file: any) => file.filename);
  console.log(newImageFile)
  const { productName, price, count, category, brand } = request.body ;
const imageId:[] = request.body.imageId.split(',')
const oldImageName = request.body.oldImageName.split(',')
// const productname = productName.substring(0, 12);
        try {
// const query = `SELECT product_id FROM product_images WHERE id = $1`;
// const product = await pool.query(query,[imageId])
// console.log(product.rows[0].product_id)
//...............................................................
let updateValues = [];
let updateFields = [];
if(!request.body){
  res.status(401).send({message:'give at least one to update'});
}else{
  if (productName) {
    updateValues.push(productName); 
    updateFields.push('productName');
}
if (price) {
    updateValues.push(price);
    updateFields.push('price');
}
if (count) {
    updateValues.push(count);
    updateFields.push('count');
}
if (brand) {
  updateValues.push(brand);
  updateFields.push('brand');
}
if (category) {
    updateValues.push(category);
    updateFields.push('category');
}
console.log("bind",updateValues)
// Construct the update query dynamically based on available fields
const updateQuery = `
    UPDATE products10
    SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ')}
    WHERE id = $${updateValues.length + 1}
`;
console.log(updateQuery)
updateValues.push(id);
console.log(updateValues,"valll")
const updateResult = await pool.query(updateQuery,updateValues)
console.log(updateResult)
}
//...............................................................
if(imageId && oldImageName && newImageFile){ 
  const updateQuery = `
  UPDATE product_images
  SET productImages = $1
  WHERE id = $2
  RETURNING *;
`;
for(let i = 0;i<newImageFile.length;i++){
  const values = [newImageFile[i], imageId[i]];    
  await pool.query(updateQuery, values);
}
// result.rows[0]; // Return the updated row
oldImageName.forEach((imageName:string) => {
  const imagePathToDelete = path.join(__dirname,'..', '..', '..', 'uploads', imageName);
console.log("kkkkkkkk",__dirname,imageName)
  fs.unlink(imagePathToDelete, (err) => {
      if (err) {
          console.error(`Error deleting image ${imageName}: ${err}`);
          return;
      }
      console.log(`Image ${imageName} deleted successfully`);
  });
});

}else{
  res.status(400).send({ Message: 'something missing' });
} 

        } catch (error) {
        console.error('Internal server error', error);
        res.status(500).send({ Message: 'Internal Server Error' });
        }
        });
















      //.............................
      products.post('/otp-login', async (request, res) => {
        const productId = request.body.id
        try {
          // const selectQuery = {
          //   text: 'SELECT productImages FROM product_images WHERE product_id = $1',
          //   values: [productId],
          // };
    
   
          // const result = await pool.query(selectQuery);

          // const productImages = result.rows.map(row => row.productimages);
    
          // console.log(`Found ${productImages.length} images for product_id ${productId}`);
          // console.log("lllllllllllllll",productImages)
          // return productImages;
          //.............................................................................................
          // const deleteQuery = 'SELECT FROM products10 WHERE id = $1';
          // const deleteResult = await pool.query(deleteQuery, [productId]);
          // console.log("deeeeeelette",deleteResult)
          //.........................................................................
          const imagePathToDelete = path.join(__dirname,'..', '..', '..', 'uploads');
console.log(imagePathToDelete)
        } catch (error) {
        console.error('Internal server error', error);
        res.status(500).send({ Message: 'Internal Server Error' });
        }
        });
      //.............................

      products.post('/loginwithotp', async (request, res) => {
       
        try {
        
        } catch (error) {
        console.error('Internal server error', error);
        res.status(500).send({ Message: 'Internal Server Error' });
        }
        });



        export default products













// const data = [
//   {name:"bab",roles:["man"]}
// ]
















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


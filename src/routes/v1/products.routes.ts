import Express, { text } from "express";
import multer, { Multer } from 'multer'
import { authorizeRole } from "../../middlewares/authorizeRoles";
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../../controllers/products.controller";
import { ROLE } from "../../interfaces/roles";
// import sms from '../../utils/sms'
import { DataStructure } from "../../interfaces/product";
import pool from "../../db/postgre";
import util from 'util'

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
const products = Express.Router();

products.post('/addProduct',upload.any(),addProduct)
products.get('/getAllProducts',authorizeRole([ROLE.ADMIN,ROLE.USER]),getAllProducts);
products.post('/deleteSingleProduct',authorizeRole([ROLE.ADMIN]),deleteProduct)
products.post('/update-product/:id',upload.array('newImageFile',5),authorizeRole([ROLE.ADMIN]),updateProduct)
















































            products.post('/addProductss',upload.any(), async (request, res) => {
                // const phoneNumber = "9567127274"
                // let jsonns = JSON.parse(request.body)
                // console.log(jsonns )
                // let body = request.body.ids
                // let vv = JSON.parse(body)
                
                // console.log("dddddd",request.files,request.file,body)

                //........................................................
                // request.files?.forEach(image => {
                //   // Extract the number from originalname
                //   const match = image.originalname.match(/\.(\d+)\./);
                //   if (match) {
                //     const number = match[1];
                //     // Find the corresponding variant value and assign originalname to fieldValue
                //     request.body.variants.forEach(variant => {
                //       variant.values.forEach(value => {
                //         if (value.id === number) {
                //           value.fieldValue = image.filename;
                //         }
                //       });
                //     });
                //   }
                // });
                
                // // Print the updated ss to verify
                // console.log(JSON.stringify(ss, null, 2));
                // const imagefiles:[] = request.files as [];
                                           // const imagefiles: any[] = (request.files as any[])
                // ?.map(
                //   (file: any) => file.filename
                // );
    try{
                // // Iterate through uploaded files
                // files.forEach((image: { originalname: string; filename: any; }) => {
                //   // Extract the number from originalname
                //   const match = image.originalname.match(/\.(\d+)\./);
                //   if (match) {
                //     const number = match[1];
                    
                //     // Find the corresponding variant value and assign originalname to fieldValue
                //     if (request.body.ids && request.body.ids.variants) {
                //       request.body.ids.variants.forEach((variant: any) => { // Assuming variant has any type, adjust as per your actual type
                //         variant.values.forEach((value: any) => { // Assuming value has any type, adjust as per your actual type
                //           if (value.id.toString() === number) { // Convert id to string for comparison
                //             value.fieldValue = image.filename;
                //           }
                //         });
                //       });
                //     }
                //   }
                // })
                // console.log(request.body.ids)
                //...................................
              
//           console.log("...............................................................................")
//           // console.log(request.body)      
// let data = request.body.productDetails
// let initials = request.body.initialProducts
// let ss= JSON.parse(data) 
// let initialProducts = JSON.parse(initials)
// console.log(initialProducts)
// console.log(ss)
// let cc = {}
// imagefiles?.map(image => {
//   // Extract the id from the originalname (assuming it's always in the format '.id.')
//   let idFromFilename = parseInt(image.originalname.split('.')[1]); // Extracts '0' or '1'
//   console.log("hhhhhhhhhhhhhhhhhhhhhhhh",idFromFilename)
//   // Check if ss.variants is defined and is an array

//     // Iterate through ss.variants
//     ss.variants?.map((variant: { values: any[]; }) => {
//       // Check if variant.values is defined and is an array
      

//         // Iterate through variant.values
//         console.log("valueeeeeeeeeeeeeeeees,",variant.values)
//         variant.values?.map(value => {
//           if (value.id === idFromFilename) {
//             // Add the images property with the filename
//             value.image = image.filename;
//             console.log("mnnnnnnnnnnnnnnnnnnnn",image.filename)
//             console.log("lilililil",value)

//           }
//         });
      
//     });
  
// });
      //  console.log("final",ss)     
const fff =await pool.query('select productvariants from products10',)    

console.log(fff.rows,typeof fff.rows,fff.rows[0].productaddon, JSON.stringify(fff.rows),"llll",fff.rows[0].productvariants[0].values[0])
console.log(util.inspect(fff.rows, { depth: null }))
console.log("llllllllllllllllllllll",util.inspect(fff.rows, { depth: null }))
// await pool.query(`CREATE TABLE IF NOT EXISTS prdct (
//   id SERIAL PRIMARY KEY,
//   bb JSONB[]
// )`)
// const obj = [{id:1,nmae:"nn",mm:'kk',bbb:[{id:1,dd:"dd",vv:"ll"},{id:2,dd:"ddc",vv:"jll"}]}]
// console.log(typeof obj)
// const insertQuery = `
// INSERT INTO prdct (bb)
// VALUES ($1)
// RETURNING *`;

// const values = [obj];
// const result = await pool.query(insertQuery, values);
// const productId = result.rows[0];
                //........................................................
                // try {
                    // const cartItemsResult = await pool.query('SELECT * FROM cart10 WHERE userid = $1', [userid]);
                    // const cartItems = cartItemsResult.rows;
            // sms(phoneNumber)
            // console.log("jjjj")
                   }   // res.status(200).send({ cartItems });
                  catch(error) {
                    console.error('Internal server error', error);
                    res.status(500).send({ message: 'Internal Server Error' });
                }
            });

export default products





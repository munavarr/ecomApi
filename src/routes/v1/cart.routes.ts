// import Express, { Request,Response, query } from "express";
// import pool from "../../db/postgre";
// const cart = Express();

// cart.post('/add-cart', async (request, res) => {
// const {productid, count ,userid} = request.body
//     try {
//     if(productid && count && userid){
//         res.status(401).send({ Message: 'somethind missing' });
//     }
//     await pool.query(`
//         CREATE TABLE IF NOT EXISTS cart10 (
//             id SERIAL PRIMARY KEY,
//              productid INT,
//              count INT,
//              userid INT
//         )
//         `); 
//     //............
//     const existingRecordResult = await pool.query('SELECT * FROM cart10 WHERE (userid,productid) = ($1, $2)', [userid,productid]);
//           if (existingRecordResult.rows.length > 0) {
//             res.status(400).send({message:'cart already exists on this user'});
//           }
          
//           const insertResult = await pool.query('INSERT INTO cart10 (productid, count, userid) VALUES ($1, $2, $3) RETURNING *;', [productid, count, userid]);
//           console.log(insertResult)
// return insertResult
//     } catch (error) {
//     console.error('Internal server error', error);
//     res.status(500).send({ Message: 'Internal Server Error' });
//     }
//     });

//     cart.post('/add-cart', async (request, res) => {
      
//             try {
       
//             } catch (error) {
//             console.error('Internal server error', error);
//             res.status(500).send({ Message: 'Internal Server Error' });
//             }
//             });

//             cart.post('/update-cart', async (request, res) => {
//                 const { id, count } = request.body;
//                 try {
//                     if (!id || !count) {
//                         return res.status(400).send({ message: 'Missing required fields' });
//                     }
//                     const existingRecordResult = await pool.query('SELECT * FROM cart10 WHERE id = $1', [id]);
//                     if (existingRecordResult.rows.length === 0) {
//                         return res.status(404).send({ message: 'Cart item not found' });
//                     }
//                     const updateResult = await pool.query('UPDATE cart10 SET count = $1 WHERE id = $2 RETURNING *', [count, id]);
//                     console.log(updateResult.rows[0]);
                    
//                     res.status(200).send({ message: 'Cart item updated successfully', updatedCartItem: updateResult.rows[0] });
//                 } catch (error) {
//                     console.error('Internal server error', error);
//                     res.status(500).send({ message: 'Internal Server Error' });
//                 }
//             });

//             cart.delete('/delete-cart/:id', async (request, res) => {
//                 const { id } = request.params;
//                 try {
                  
//                     const existingRecordResult = await pool.query('SELECT * FROM cart10 WHERE id = $1', [id]);
//                     if (existingRecordResult.rows.length === 0) {
//                         return res.status(404).send({ message: 'Cart item not found' });
//                     }
            
                  
//                     await pool.query('DELETE FROM cart10 WHERE id = $1', [id]);
            
//                     res.status(200).send({ message: 'Cart item deleted successfully' });
//                 } catch (error) {
//                     console.error('Internal server error', error);
//                     res.status(500).send({ message: 'Internal Server Error' });
//                 }
//             });

//             cart.get('/get-cart/:userid', async (request, res) => {
//                 const { userid } = request.params;
//                 try {
//                     const cartItemsResult = await pool.query('SELECT * FROM cart10 WHERE userid = $1', [userid]);
//                     const cartItems = cartItemsResult.rows;
            
//                     res.status(200).send({ cartItems });
//                 } catch (error) {
//                     console.error('Internal server error', error);
//                     res.status(500).send({ message: 'Internal Server Error' });
//                 }
//             });
            
            
            


            

//     export default cart



















    //...........................................................................
    // cart.post('/update-cart', async (request, res) => {
    //     const { productid, count, userid } = request.body;
    //     try {
    //         if (!productid || !count || !userid) {
    //             return res.status(400).send({ message: 'Missing required fields' });
    //         }
    
    //         // Check if the cart item exists for the given user and product
    //         const existingRecordResult = await pool.query('SELECT * FROM cart10 WHERE userid = $1 AND productid = $2', [userid, productid]);
    //         if (existingRecordResult.rows.length === 0) {
    //             return res.status(404).send({ message: 'Cart item not found' });
    //         }
    
    //         // Update the count of the existing cart item
    //         const updateResult = await pool.query('UPDATE cart10 SET count = $1 WHERE userid = $2 AND productid = $3 RETURNING *', [count, userid, productid]);
    //         console.log(updateResult.rows[0]);
            
    //         res.status(200).send({ message: 'Cart item updated successfully', updatedCartItem: updateResult.rows[0] });
    //     } catch (error) {
    //         console.error('Internal server error', error);
    //         res.status(500).send({ message: 'Internal Server Error' });
    //     }
    // });
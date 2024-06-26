import Express, { Request,Response, query } from "express";
import pool from "../../db/postgre";
const order = Express();

order.post('/add-order', async (request, res) => {
const {productid, count ,userid} = request.body
    try {
    if(!productid || !count || !userid){
        res.status(401).send({ Message: 'somethind missing' });
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
    const existingRecordResult = await pool.query('SELECT * FROM order10 WHERE (userid,productid) = ($1, $2)', [userid,productid]);
          if (existingRecordResult.rows.length > 0) {
            res.status(400).send({message:'order already exists on this user'});
          }else{
          //..............
        //   const foundProduct.rows[0].countl.query('SELECT count FROM products10 WHERE id = $1', [productid]);
        //   const productPriceResult = await pool.query('SELECT price FROM products10 WHERE id = $1', [productid]);

        const foundProduct = await pool.query('SELECT * FROM products10 WHERE id = $1', [productid]);


        // // const foundProduct = existingRecordResult:existingRecordResult.rows[0].price
                 
          if (!foundProduct.rows[0].count) {
              return res.status(404).send({ message: 'Product price not found' });
          }
  
          const productCount = parseInt(foundProduct.rows[0].count);
          const productprice = parseInt(foundProduct.rows[0].price);
  
          // Check if count is less than 10
          if (count > productCount) {
              res.status(200).send({ message: `Product count (${count}) is more than actual count ${productCount}` });
          } else {
              const newCount = productCount - count
              
              await pool.query('UPDATE products10 SET count = $1 WHERE id = $2', [newCount,productid]); 

          }
        //   //..............
          const total = productprice * count
          const insertResult = await pool.query('INSERT INTO order10 (productid, count, userid, total) VALUES ($1, $2, $3, $4) RETURNING *;', [productid, count, userid, total]);
          console.log(insertResult)
          res.status(200).send(insertResult);
        }
    } catch (error) {
    console.error('Internal server error', error);
    res.status(500).send({ Message: 'Internal Server Error' });
    }
    });

    order.post('/add-order', async (request, res) => {
      
            try {
       
            } catch (error) {
            console.error('Internal server error', error);
            res.status(500).send({ Message: 'Internal Server Error' });
            }
            });

            order.put('/update-order', async (request, res) => {
                const { id, count } = request.body;
                try {
                    if (!id || !count) {
                        return res.status(400).send({ message: 'Missing required fields' });
                    }
                    const existingRecordResult = await pool.query('SELECT * FROM order10 WHERE id = $1', [id]);
                    if (existingRecordResult.rows.length === 0) {
                        return res.status(404).send({ message: 'order item not found' });
                    }
                    //.............
                    
                    const foundProduct = await pool.query('SELECT * FROM products10 WHERE id = $1', [id]);

                 
                    if (!foundProduct.rows[0].count) {
                        return res.status(404).send({ message: 'Product not found' });
                    }
            
                    const productCount = parseInt(foundProduct.rows[0].count);
                    const productPrice = parseInt(foundProduct.rows[0].price);
                    // Check if count is less than 10
                    if (count > productCount) {
                        res.status(200).send({ message: `Product count (${count}) is more than actual count ${productCount}` });
                    } else {
                        const newCount = productCount - count
                        await pool.query('UPDATE products10 SET count = $1 WHERE id = $2', [newCount, id]); 
 
                    }
                    //.............
                    const total = productPrice * count
                    const updateResult = await pool.query('UPDATE order10 SET count = $1, total = $2 WHERE id = $3 RETURNING *', [count,total, id]);
                    console.log(updateResult.rows[0]);
                    
                    res.status(200).send({ message: 'Cart item updated successfully', updatedCartItem: updateResult.rows[0] });
                } catch (error) {
                    console.error('Internal server error', error);
                    res.status(500).send({ message: 'Internal Server Error' });
                }
            });

            order.delete('/delete-order/:id', async (request, res) => {
                const { id } = request.params;
                try {
                  
                    const existingRecordResult = await pool.query('SELECT * FROM order10 WHERE id = $1', [id]);
                    if (existingRecordResult.rows.length === 0) {
                        return res.status(404).send({ message: 'Cart item not found' });
                    }
            
                  
                    await pool.query('DELETE FROM order10 WHERE id = $1', [id]);
            
                    res.status(200).send({ message: 'Cart item deleted successfully' });
                } catch (error) {
                    console.error('Internal server error', error);
                    res.status(500).send({ message: 'Internal Server Error' });
                }
            });

            order.get('/order/:userid', async (req, res) => {
                const { userid } = req.params;
                try {
                  




                    const query = `
                        SELECT 
                            o.id AS order_id, 
                            p.id AS product_id, 
                            p.productName, 
                            p.price, 
                            p.count AS product_count,  
                            p.brand, 
                            o.count AS order_count,
                            o.total
                        FROM 
                            order10 o
                        INNER JOIN 
                            products10 p ON o.productid = p.id
                        INNER JOIN 
                            users10 u ON o.userid = u.id     
                        WHERE 
                            o.userid = $1
                    `;
                    const { rows } = await pool.query(query, [userid]);
                   const product_ids =  rows.map((id)=>id.product_id)
                   console.log(product_ids)
// const prodimages = await pool.query(imagequery);

// const product_ids = [1,2]
const placeholders = product_ids.map((id, index) => `$${index + 1}`).join(', ');

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
const prodimages = await pool.query(imgquery)
                    
            console.log("rowwwws",prodimages)
                  
                    if (rows.length === 0) {
                        return res.status(404).send({ message: 'No orders found for this user' });
                    }


//..............
const imageMap:any = {};
prodimages.rows.forEach((image:any) => {
    const { id, productimages,imgid } = image;
    if (!imageMap[id]) {
        imageMap[id] = [];
    }
    imageMap[id].push(productimages);
});

// Merge images into rows based on product_id
const mergedData = rows.map(row => ({
    ...row,
    images: imageMap[row.product_id] || [] // Assign empty array if no images found
}));

console.log(mergedData);
//..............





                      
                    res.status(200).send({ 
                        // rows:rows,img:prodimages.rows,
                        result:mergedData });
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    res.status(500).send({ message: 'Internal Server Error' });
                }
            });
            
            
           //.......................................
           order.post('/orders', async (req, res) => {
            const {productid, count ,userid} = req.body

            const existingRecordResult = await pool.query('SELECT * FROM products10 WHERE id = $1', [productid]);

            try {
//     const query = `
//   SELECT 
//     p.id AS product_id,
//     pi.productImages
//   FROM products10 p
//   LEFT JOIN product_images pi ON p.id = pi.product_id
//   LIMIT 1
// `;

// const { rows } = await pool.query(query);
console.log(existingRecordResult.rows)
// res.send(rows)
res.status(200).send({ existingRecordResult:existingRecordResult.rows[0].price });

            } catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).send({ message: 'Internal Server Error' });
            }
        }); 


            

    export default order



















    //...........................................................................
    // order.post('/update-order', async (request, res) => {
    //     const { productid, count, userid } = request.body;
    //     try {
    //         if (!productid || !count || !userid) {
    //             return res.status(400).send({ message: 'Missing required fields' });
    //         }
    
    //         // Check if the order item exists for the given user and product
    //         const existingRecordResult = await pool.query('SELECT * FROM order10 WHERE userid = $1 AND productid = $2', [userid, productid]);
    //         if (existingRecordResult.rows.length === 0) {
    //             return res.status(404).send({ message: 'Cart item not found' });
    //         }
    
    //         // Update the count of the existing order item
    //         const updateResult = await pool.query('UPDATE order10 SET count = $1 WHERE userid = $2 AND productid = $3 RETURNING *', [count, userid, productid]);
    //         console.log(updateResult.rows[0]);
            
    //         res.status(200).send({ message: 'Cart item updated successfully', updatedCartItem: updateResult.rows[0] });
    //     } catch (error) {
    //         console.error('Internal server error', error);
    //         res.status(500).send({ message: 'Internal Server Error' });
    //     }
    // });
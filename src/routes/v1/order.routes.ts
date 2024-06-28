import Express from "express";
import { authorizeRole } from "../../middlewares/authorizeRoles";
import { ROLE } from "../../interfaces/roles";
import { addOrder, deleteOrder, getOrder, updateOrder } from "../../controllers/order.controller";

const order = Express.Router(); 

order.post('/add-order',authorizeRole([ROLE.ADMIN,ROLE.USER]),addOrder);
order.put('/update-order',authorizeRole([ROLE.ADMIN,ROLE.USER]),updateOrder)
order.delete('/cancel-order/:id',authorizeRole([ROLE.ADMIN,ROLE.USER]),deleteOrder)
order.get('/order',authorizeRole([ROLE.ADMIN,ROLE.USER]),getOrder)

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
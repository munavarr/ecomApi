import Express from "express";
import multer from 'multer'
import { authorizeRole } from "../../middlewares/authorizeRoles";
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../../controllers/products.controller";
import { ROLE } from "../../interfaces/roles";
import sms from '../../utils/sms'

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

products.post('/addProduct',upload.array('productImages', 5),authorizeRole([ROLE.ADMIN]),addProduct)
products.get('/getAllProducts',authorizeRole([ROLE.ADMIN,ROLE.USER]),getAllProducts);
products.post('/deleteSingleProduct',authorizeRole([ROLE.ADMIN]),deleteProduct)
products.post('/update-product/:id',upload.array('newImageFile',5),authorizeRole([ROLE.ADMIN]),updateProduct)

            products.post('/selectt', async (request, res) => {
                const phoneNumber = "9567127274"
                try {
                    // const cartItemsResult = await pool.query('SELECT * FROM cart10 WHERE userid = $1', [userid]);
                    // const cartItems = cartItemsResult.rows;
            // sms(phoneNumber)
            console.log("jjjj")
                    // res.status(200).send({ cartItems });
                } catch (error) {
                    console.error('Internal server error', error);
                    res.status(500).send({ message: 'Internal Server Error' });
                }
            });

export default products



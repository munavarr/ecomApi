import Express from "express";
import multer from 'multer'
import { authorizeRole } from "../../middlewares/authorizeRoles";
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../../controllers/products.controller";
import { ROLE } from "../../interfaces/roles";

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

export default products



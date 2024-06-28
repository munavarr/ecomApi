import Express from "express";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../../controllers/category.controller";
import { authorizeRole } from "../../middlewares/authorizeRoles";
import { ROLE } from "../../interfaces/roles";
import multer from "multer";

const categories = Express();
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

categories.post('/add-category',upload.single('categoryimage'), addCategory);
categories.put('/update-category/:id',upload.single('newimagefile'),updateCategory);
categories.get('/get-all-category',authorizeRole([ROLE.ADMIN,ROLE.USER]),getAllCategories);
categories.delete('/delete-category/:id',authorizeRole([ROLE.ADMIN]),deleteCategory);

export default categories
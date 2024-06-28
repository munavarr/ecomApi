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
categories.post('/update-category',authorizeRole([ROLE.ADMIN,ROLE.USER]),updateCategory);
categories.post('/delete-category',authorizeRole([ROLE.ADMIN,ROLE.USER]),deleteCategory);
categories.get('/get-all-category',getAllCategories);

export default categories
import { Router } from "express";
import AuthRoutes from "./auth.routes";
import ProductsRoutes from "./products.routes";
import orderRoutes from "./order.routes";
import categoryRoutes from "./categories.routes";
const router = Router();

router.use("/auth", AuthRoutes);
router.use("/products", ProductsRoutes);
router.use("/order", orderRoutes);
router.use("/category", categoryRoutes);

export default router;

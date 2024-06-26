import { Router } from "express";
import  Express  from "express";
import AuthRoutes from "./auth.routes"
import ProductsRoutes from "./products.routes";
import orderRoutes from "./order.routes"
const router =Router()

router.use("/auth", AuthRoutes)
router.use("/products", ProductsRoutes)
router.use("/order", orderRoutes)

export default router
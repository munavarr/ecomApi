import { Router } from "express";
import  Express  from "express";
import AuthRoutes from "./auth.routes"
import ProductsRoutes from "./products.routes";

const router =Router()

router.use("/auth", AuthRoutes)
router.use("/products", ProductsRoutes)

export default router
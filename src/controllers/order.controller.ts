import { Request, Response } from "express";
import {
  addTheOrder,
  deleteTheOrder,
  getTheOrder,
} from "../services/order.service";
import { updateProduct } from "./products.controller";

export async function addOrder(req: Request, res: Response): Promise<void> {
  const { productid, count, userid } = req.body;
  try {
    const addOrder = await addTheOrder(productid, count, userid);
    res.status(200).send(addOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function getOrder(req: Request, res: Response): Promise<void> {
  // const { orderid } = req.params;
  const { userid, role } = req.body;
  console.log(userid, "controller");
  // const {role} = req.body.role
  try {
    const addOrder = await getTheOrder(userid, role);
    res.status(200).send(addOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function updateOrder(req: Request, res: Response): Promise<void> {
  const { id, count } = req.body;
  try {
    if (!id || !count) {
      res.status(400).send({ message: "Missing required fields" });
    }
    const updateOrder = await updateProduct(id, count);
    res.status(200).send(updateOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function deleteOrder(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const deleteOrder = await deleteTheOrder(id);
    res.status(200).send(deleteOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

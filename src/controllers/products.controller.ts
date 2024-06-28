import {
  addTheProduct,
  deleteTheProduct,
  getAllTheProducts,
  updateTheProduct,
} from "../services/products.service";
import { Request, Response } from "express";
export async function addProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productName, price, count, category, brand } = req.body;
    const productImages: string[] = (req.files as any[])?.map(
      (file: any) => file.filename
    );
    const addProduct = await addTheProduct(
      productName,
      price,
      count,
      category,
      brand,
      productImages
    );
    res.status(200).send(addProduct);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function getAllProducts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    //if its req.query then they ask for type becaus either we didnt mention the quwery parse or
    const { pageNumber, pageSize } = req.body;
    const getAllProducts = await getAllTheProducts(pageNumber, pageSize);
    res.status(200).send(getAllProducts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.body.id;
  try {
    const deleteProduct = await deleteTheProduct(id);
    res.status(200).send(deleteProduct);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  const id = parseInt(req.params.id);
  // const newImageFile = request.files;
  const newImageFile: string[] = (req.files as any[])?.map(
    (file: any) => file.filename
  );
  console.log(newImageFile);
  const { productName, price, count, category, brand } = req.body;
  const imageId: [] = req.body.imageId.split(",");
  const oldImageName = req.body.oldImageName.split(",");
  try {
    if (!req.body) {
      res.status(401).send({ message: "give at least one to update" });
    } else {
      const updateProduct = await updateTheProduct(
        id,
        newImageFile,
        productName,
        price,
        count,
        category,
        brand,
        imageId,
        oldImageName
      );
      res.status(200).send(updateProduct);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

import { Request, Response } from "express";
import { addTheCategory, deleteTheCategory, getAllTheCategories, updateTheCategory } from "../services/category.service";


export async function addCategory(req: Request, res: Response): Promise<void> {
    const  { categoryName,description,parentId} = req.body
const categoryimage: string = req.file?.filename as string;
  try {
    const addCategory = await addTheCategory(categoryName,description,parentId,categoryimage);
    res.status(200).send(addCategory);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
  // const newImageFile = request.files;
  const newImageFile: string = req.file?.filename as string 
  const { categoryName,description} = req.body;
  const imageId = req.body.imageId;
  const oldImageName = req.body.oldImageName;
  try {
    if (!req.body) {
      res.status(401).send({ message: "give at least one to update" });
    } else {
    const updateCategory = await updateTheCategory(id,categoryName,imageId,description,newImageFile,oldImageName );
    res.status(200).send(updateCategory);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
    const {id} = req.params;
    const {full} = req.body
  try {
    if (!id) {
      res.status(401).send({ message: "id not found" });
    } else {
    const deleteCategory = await deleteTheCategory(id,full);
    res.status(200).send(deleteCategory);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getAllCategories(req: Request, res: Response): Promise<void> {
  try {
    const {pageNumber,pageSize} = req.body
    const getCategories = await getAllTheCategories(pageNumber,pageSize); 
    res.status(200).send(getCategories);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
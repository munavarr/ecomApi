import pool from "../db/postgre";
import path from "path";
import fs from "fs";
import { HttpException } from "../exceptions/HttpException";

export async function addTheCategory(
  categoryName: string,
  description: string,
  parentId: string,
  categoryimage: string
): Promise<any> {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS category10 (
        id SERIAL PRIMARY KEY,
        parentid INT,
        categoryname VARCHAR(12),
        description TEXT
        )
        `);
  await pool.query(`
         CREATE TABLE IF NOT EXISTS category_images (
          id SERIAL PRIMARY KEY,
          category_id INTEGER REFERENCES category10(id),
          categoryImages TEXT
      )
          `);
  const existingCategoryQuery =
    "SELECT * FROM category10 WHERE categoryname = $1";
  const existingCategoryResult = await pool.query(existingCategoryQuery, [
    categoryName,
  ]);

  if (existingCategoryResult.rows.length > 0) {
    throw new Error("The category already exists");
  } else {
    const insertQuery = `
          INSERT INTO category10 (categoryname, description, parentid)
          VALUES ($1, $2, $3)
          RETURNING *`;

    const values = [categoryName, description, parentId ? parseInt(parentId):null];
    const result = await pool.query(insertQuery, values);
    const categoryId = result.rows[0].id;

    const insertImageQuery = `
  INSERT INTO category_images (category_id, categoryImages)
  VALUES ($1, $2)`;
    await pool.query(insertImageQuery, [categoryId, categoryimage]);
    await pool.query("COMMIT");
    console.log(result.rows[0]);
    return { result: result.rows[0] };
  }
}

export async function updateTheCategory(
  id: number,
  categoryName: string,
  imageId: string,
  description: string,
  newImageFile: string,
  oldImageName: string
): Promise<any> {
  let updateValues = [];
  let updateFields = [];
  {
    if (categoryName) {
      updateValues.push(categoryName);
      updateFields.push("categoryName");
    }
    if (description) {
      updateValues.push(description);
      updateFields.push("description");
    }
    console.log("bind", updateValues);
    // Construct the update query dynamically based on available fields
    const updateQuery = `
          UPDATE category10
          SET ${updateFields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(", ")}
          WHERE id = $${updateValues.length + 1}
      `;
    console.log(updateQuery);
    updateValues.push(id);
    console.log(updateValues, "valll");
    const updateResult = await pool.query(updateQuery, updateValues);
    console.log(updateResult);
  }
  //...............................................................
  if (imageId && oldImageName && newImageFile) {
    const updateQuery = `
        UPDATE category_images
        SET categoryImages = $1
        WHERE id = $2
        RETURNING *;
      `;
    const values = [newImageFile, parseInt(imageId)];
    await pool.query(updateQuery, values);

    // result.rows[0]; // Return the updated row

    const imagePathToDelete = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      oldImageName
    );
    console.log("kkkkkkkk", __dirname, oldImageName);
    fs.unlink(imagePathToDelete, (err) => {
      if (err) {
        console.error(`Error deleting image ${oldImageName}: ${err}`);
        return;
      }
      console.log(`Image ${oldImageName} deleted successfully`);
    });
  } 
}
export async function deleteTheCategory(id: string,full:boolean): Promise<any> {
  const categoryQuery = "SELECT * FROM category10 WHERE id = $1";
  const category = await pool.query(categoryQuery, [parseInt(id)]);

  if (category.rows.length === 0) {
    throw new HttpException(404, "cateogory not found");
  }

if(full){
  const idsOfParentIdDependsQuery = (await pool.query('SELECT id FROM category10 WHERE parentid = $1',[parseInt(id)])).rows
  const idsOfParentIdDepends:any = idsOfParentIdDependsQuery.map(ids=>ids.id) 
  idsOfParentIdDepends.push(parseInt(id))
const categoryImagesResults = [];
for (const id of idsOfParentIdDepends) {
  try {
    const getCategoryImagesQuery = await pool.query('SELECT categoryImages FROM category_images WHERE category_id = $1', [id]);
    categoryImagesResults.push(getCategoryImagesQuery.rows[0].categoryimages);
  } catch (error) {
    console.error('Error executing query:', error);
  }
}
  const imageNamesToDelete = categoryImagesResults;
  imageNamesToDelete.forEach((imageName: string) => {
    const imagePathToDelete = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      imageName
    );
    fs.unlink(imagePathToDelete, (err) => {
      if (err) {
        console.error(`Error deleting image ${imageName}: ${err}`);
        return;
      }
      console.log(`Image ${imageName} deleted successfully`);
    });
  });
  for (const id of idsOfParentIdDepends) {
    try {
      await pool.query(`DELETE FROM category_images WHERE category_id = $1`,[id])
      await pool.query(`DELETE FROM category10 WHERE id = $1`,[id])
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }
}else{
  const parentIdToPass = category.rows[0].parentid
  const categoryimageQuery = {
    text: "SELECT categoryImages FROM category_images WHERE category_id = $1",
    values: [parseInt(id)],
  };
  const categoryimage = await pool.query(categoryimageQuery);
  const imageNameToDelete = categoryimage.rows[0].categoryimages;
 const categoryParentIdupdateQuery = `
        UPDATE category10
        SET parentid = $1
        WHERE parentid = $2
        RETURNING *;
      `;
await pool.query(categoryParentIdupdateQuery,[parentIdToPass,parseInt(id)])
  const imagePathToDelete = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    imageNameToDelete
  );
  fs.unlink(imagePathToDelete, (err) => {
    if (err) {
      console.error(`Error deleting image ${imageNameToDelete}: ${err}`);
      return;
    }
    console.log(`Image ${imageNameToDelete} deleted successfully`);
  });
  const deleteimageQuery = {
    text: "DELETE FROM category_images WHERE category_id = $1",
    values: [parseInt(id)],
  };
  const deleteImageresult = await pool.query(deleteimageQuery);
  // const productimagesdeleteresult =  result.rowCount; // Return the number of rows deleted
  const deleteQuery = "DELETE FROM category10 WHERE id = $1";
  const deleteResult = await pool.query(deleteQuery, [parseInt(id)]);
  return {deleteCategory:deleteResult.rows,deleteimagecategory:deleteImageresult};
}
}

// }

  // const imageNamesToDelete = result.map((id) => id.productimages);
//   console.log("imagenames", imageNamesToDelete);
//   imageNamesToDelete.forEach((imageName: string) => {
//     const imagePathToDelete = path.join(
//       __dirname,
//       "..",
//       "..",
//       "..",
//       "uploads",
//       imageName
//     );
//     console.log("kkkkkkkk", __dirname, imageName);
//     fs.unlink(imagePathToDelete, (err) => {
//       if (err) {
//         console.error(`Error deleting image ${imageName}: ${err}`);
//         return;
//       }
//       console.log(`Image ${imageName} deleted successfully`);
//     });
//   });
// }
 
 
//  const categoryParentIdupdateQuery = `
//         UPDATE category10
//         SET parentid = $1
//         WHERE id = $2
//         RETURNING *;
//       `;
//   await getCategoryToPassParentId.forEach(element => {
//     pool.query(categoryParentIdupdateQuery,[parentIdToPass,element]);
//    });
     



export async function getAllTheCategories(
  pageNumber: number,
  pageSize: number
): Promise<any> {
  // const offset = (pageNumber - 1) * pageSize;
  const query = `
    SELECT 
        c.id, 
        ci.id, 
        c.categoryName, 
        c.description,
        c.parentid,
        ci.categoryImages
    FROM 
        category_images ci
    INNER JOIN 
        category10 c ON ci.category_id = c.id
`;
  const prodData = await pool.query(query);
  const productsData = prodData.rows;

  const baseUrl = "http://localhost:3000/";

  function buildCategoryTree(parentId: number) {
    let subtree: any[] = productsData
      .filter((item) => item.parentid === parentId)
      .map((item) => ({
        categoryid: item.id,
        categoryname: item.categoryname,
        description: item.description,
        categoryimage: baseUrl + item.categoryimages,
        subcategories: buildCategoryTree(item.id),
      }));
    return subtree.length > 0 ? subtree : [];
  }

  const arrangedData = productsData
    .filter((item) => item.parentid === null)
    .map((item) => ({
      categoryid: item.id,
      categoryname: item.categoryname,
      description: item.description,
      categoryimage: baseUrl + item.categoryimages,
      subcategories: buildCategoryTree(item.id),
    }));
  console.log(arrangedData);
  return arrangedData;
}
// export async function getAllTheProducts(pageNumber:number,pageSize:number):Promise<any>{

// }

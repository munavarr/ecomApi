
import jwt, { JwtPayload } from "jsonwebtoken";
import pool from "../db/postgre";

import { RequestHandler, Request, Response, NextFunction, request } from 'express';

export function authorizeRole(roles: string[]): RequestHandler {
  console.log(roles)
    return async (request: Request, res: Response, next: NextFunction) => {
         const authorizationHeader = request.header("Authorization");
    const token = (authorizationHeader && authorizationHeader.split("Bearer ")[1]) || null;
    
 console.log("tojen",token)  

    if (!token) {
      return res
        .status(401)
        .send({ message: "no token" });
    }

    try {
        const decod = jwt.verify(token, '1111111') as JwtPayload
        console.log("decodid",decod.id)
      const founduser = await pool.query('SELECT role FROM users10 WHERE id = $1', [decod.id]); 
    console.log("lllllllllll",founduser.rows[0].role)
      const user = founduser.rows[0]
// console.log("authuser",user)
      if (!user) {
        return res.status(400).send({ message: "Invalid user" });
      }

      const authorizedRole = roles.find((role) => user.role === role );
console.log("authorizeroles",authorizedRole)
      if (!authorizedRole) {
        return res
          .status(403)
          .send({ message: "Access denied. Not an authorized role" });
      }
console.log(decod.id,user.role)
  request.body.userid = decod.id;
  request.body.role = user.role

        next();
        console.log("bodddy",request.body)
    }catch(error){
      return res.status(400).send({ message: "Invalid token" });
    }
}
}
// export function authorizeRole(roles:string[]){
    
  // console.log(roles)
//   async(request:Request, res:Response, next:NextFunction) => {
//     const authorizationHeader = request.header("Authorization");
//     const token = (authorizationHeader && authorizationHeader.split("Bearer ")[1]) || null;
    
 

//     if (!token) {
//       return res
//         .status(401)
//         .send({ message: "no token" });
//     }

//     try {
//         const decod = jwt.verify(token, '1111111') as JwtPayload
//         const user = (await pool.query('SELECT role FROM users10 WHERE id = $1', [decod.id])).rows[0]; 
    
      

//       if (!user) {
//         return res.status(400).send({ message: "Invalid user" });
//       }

//       const authorizedRole = roles.find((role) => user.role === role );

//       if (!authorizedRole) {
//         return res
//           .status(403)
//           .send({ message: "Access denied. Not an authorized role" });
//       }

//       request.body.user = user.id;
      
//       next();
//     } catch (error) {
//       return res.status(400).send({ message: "Invalid token" });
//     }
//   };
// }
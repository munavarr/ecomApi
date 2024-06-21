import Express, { Router, Request, Response, request } from "express";
import pool from "../../db/postgre";
import generateOTP from "../../utils/otp.utils";
import  Jwt  from 'jsonwebtoken';
import { execFileSync, execSync } from "child_process"
import exec from "node:child_process"



const auth = Express();

auth.post('/registerPhone', async (request, res) => {
    try{
      const requestBody:any = request.body as any ;
    const phoneNumber:any = requestBody.phoneNumber as any ;
    console.log(phoneNumber)
    if(phoneNumber.length !== 12 ){
      res.status(401).send("the number should be 12 digits")
    }
       
  await pool.query(`
CREATE TABLE IF NOT EXISTS users10 (
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(12),
    otp INTEGER,
    username VARCHAR(255) CHECK (LENGTH(username) >= 5 AND LENGTH(username) <= 50)
)
`); 

const existingRecordResult = await pool.query('SELECT * FROM users10 WHERE phoneNumber = $1', [phoneNumber]);
          if (existingRecordResult.rows.length > 0) {
            const updateCarsQuery = `
            UPDATE cars
            SET color = $1
            WHERE brand = $2;
          `;
          const generateOtp: string = generateOTP(6);
          const otp: number = parseInt(generateOtp, 10);
          // const sms = sendSMS(phoneNumber,otp)
          const updateExistingRecordResult = await pool.query('UPDATE users10 SET otp = $1 WHERE phoneNumber = $2 RETURNING *;', [otp, phoneNumber]);
         
              res.status(200).send({id:updateExistingRecordResult.rows[0].id,otp:otp})
          }else{

            const generateOtp: string = generateOTP(6);
            const otp: number = parseInt(generateOtp, 10);
        // const sms = sendSMS(phoneNumber,otp)
        // const insertResult = await pool.query('INSERT INTO user10 (phoneNumber, otp) VALUES ($1, $2) RETURNING *;', [phoneNumber, otp]);
        
const insertResult = await pool.query('INSERT INTO users10 (phoneNumber, otp) VALUES ($1, $2) RETURNING *;', [phoneNumber, otp]);

        res.status(200).send({id:insertResult.rows[0].id,otp:otp});   }     
          }     
catch (error) {
console.error('internal server error', error);
throw error;
}});

//login


auth.post('/loginwithotp', async (request, res) => {
try {
const loginData = request.body ; 
const { id, otp } = loginData;

const user = await pool.query('SELECT * FROM users10 WHERE id = $1 AND otp = $2', [id, otp]);

if (user.rows.length === 0) {
  res.status(404).send({ Message: 'No user found with the provided ID and OTP' });
  return;
}

await pool.query('UPDATE users10 SET otp = null WHERE id = $1', [id]);


const token = Jwt.sign({ id: user.rows[0].id }, '1111111');

res.status(200).send({token:token, role: 'user',id:id });
} catch (error) {
console.error('Internal server error', error);
res.status(500).send({ Message: 'Internal Server Error' });
}
});



export default auth




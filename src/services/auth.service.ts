import pool from "../db/postgre";
import { HttpException } from "../exceptions/HttpException";
import generateOTP from "../utils/otp.utils";
import Jwt from "jsonwebtoken";
// import sendSMS from "../utils/sms";

export async function register(
  phoneNumber: string,
  username: string
): Promise<any> {
  if (phoneNumber.length !== 10) {
    throw new HttpException(401, "the number should be 12 digits");
  }
  await pool.query(`
  CREATE TABLE IF NOT EXISTS users10 (
      id SERIAL PRIMARY KEY,
      phoneNumber VARCHAR(12),
      otp INTEGER,
      username VARCHAR(12),
      role VARCHAR(12),
      currentTime BIGINT
  )
  `);
  const existingRecordResult = await pool.query(
    "SELECT * FROM users10 WHERE phoneNumber = $1",
    [phoneNumber]
  );
  if (existingRecordResult.rows.length > 0) {
    //   const updateCarsQuery = `
    //   UPDATE cars
    //   SET color = $1
    //   WHERE brand = $2;
    // `;
    const generateOtp: string = generateOTP(6);
    const otp: number = parseInt(generateOtp, 10);
    // const sms = await sendSMS(phoneNumber, otp);
    const sms = true
    const currentTime: number = new Date().getTime();
    console.log("GETTIME", currentTime);
    if (sms) {
      const updateExistingRecordResult = await pool.query(
        "UPDATE users10 SET otp = $1, currentTime = $2 WHERE phoneNumber = $3 RETURNING *;",
        [otp, currentTime, phoneNumber]
      );

      return { id: updateExistingRecordResult.rows[0].id, otp: otp };
    }
  } else {
    const currentTime: number = new Date().getTime();
    const generateOtp: string = generateOTP(6);
    const otp: number = parseInt(generateOtp, 10);
    // const sms = await sendSMS(phoneNumber, otp);
    const sms = true
    // const insertResult = await pool.query('INSERT INTO user10 (phoneNumber, otp) VALUES ($1, $2) RETURNING *;', [phoneNumber, otp]);
    if (sms) {
      const insertResult = await pool.query(
        "INSERT INTO users10 (phoneNumber, otp, username, role, currentTime) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [phoneNumber, otp, username, "user", currentTime]
      );
      return { id: insertResult.rows[0].id, otp: otp };
    }
  }
}
export async function login(id: any, otp: any): Promise<any> {
  const user = await pool.query(
    "SELECT * FROM users10 WHERE id = $1 AND otp = $2",
    [id, otp]
  );

  if (user.rows.length === 0) {
    throw new HttpException(400, "No user found with the provided ID and OTP");
  }

  await pool.query("UPDATE users10 SET otp = null WHERE id = $1", [id]);
  const verificationTime = await pool.query(
    "SELECT currentTime FROM users10 WHERE id = $1",
    [id]
  );
  console.log(
    "verify",
    typeof BigInt(verificationTime.rows[0].currenttime),
    verificationTime.rows[0].currenttime,
    new Date().getTime(),
    "setime",
    5 * 60 * 1000
  );
  const timeElapsed =
    new Date().getTime() - verificationTime.rows[0].currenttime;
  console.log(timeElapsed);
  const withinTimeLimit = timeElapsed < 1 * 60 * 1000; // 5 minutes in milliseconds
  const token = Jwt.sign({ id: user.rows[0].id }, "1111111");
  if (withinTimeLimit) {
    return { token: token, role: user.rows[0].role, id: id };
  } else {
    throw new HttpException(404, "time exceeded");
  }
}

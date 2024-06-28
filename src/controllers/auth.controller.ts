import { Request, Response } from "express";
import { login, register } from "../services/auth.service";

export async function registerWithPhone(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const requestBody: any = req.body as any;
    const phoneNumber: any = requestBody.phoneNumber as any;
    const username: any = requestBody.username as any;
    const registerWithPhone = await register(phoneNumber, username);
    res.status(200).send(registerWithPhone);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function loginWithOtp(req: Request, res: Response): Promise<void> {
  try {
    const loginData = req.body;
    const { id, otp } = loginData;
    const registerWithPhone = await login(id, otp);
    res.status(200).send(registerWithPhone);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

import crypto from 'crypto';

export default function generateOTP(length: number): string {
  const digits = '123456789'; 
  let otp = '';

  otp += digits[crypto.randomInt(0, digits.length)];

  for (let i = 1; i < length; i++) {
    const randomIndex = crypto.randomInt(0, 10); 
    otp += randomIndex === 0 ? '0' : digits[randomIndex - 1];
  }

  return otp;
}





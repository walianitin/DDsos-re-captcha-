import express, { Request, Response } from "express";
import { otpLimiter, passwordResetLimiter } from "../ratelimeter";
import axios from 'axios'
import cors from "cors";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
const SECRET_KEY = "your_site_secret";
// Use a properly typed OTP
const otpStore: Record<string, string> = {};
// Generate OTP Route
app.post('/generate-otp',otpLimiter, (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`);
  res.status(200).json({ message: "OTP generated and logged" });
});

// Reset Password Route
app.post('/reset-password',passwordResetLimiter, (req: Request, res: Response) => {
  const { email, otp, newPassword ,token} = req.body;


  let formData = new FormData();
	formData.append('secret', SECRET_KEY);
	formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const result = await fetch(url, {
		body: formData,
		method: 'POST',
	});
  const challengeSucceeded = (await result.json()).success;

  if (!challengeSucceeded) {
    return res.status(403).json({ message: "Invalid reCAPTCHA token" });
  }
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }
  if (otpStore[email] === otp) {
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    delete otpStore[email]; // Clear the OTP after use
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

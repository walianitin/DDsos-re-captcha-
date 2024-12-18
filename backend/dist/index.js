"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratelimeter_1 = require("./ratelimeter");
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Use a properly typed OTP
const otpStore = {};
// Generate OTP Route
app.post('/generate-otp', ratelimeter_1.otpLimiter, (req, res) => {
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
app.post('/reset-password', ratelimeter_1.passwordResetLimiter, (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email]; // Clear the OTP after use
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    else {
        res.status(401).json({ message: "Invalid OTP" });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

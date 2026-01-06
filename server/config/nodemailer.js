import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for TLS
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  }
});

// Verify transporter on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Nodemailer configuration error:", err);
  } else {
    console.log("✅ Nodemailer ready to send emails");
  }
});
console.log("EMAIL_USER:", process.env.SENDER_EMAIL ? "SET" : "NOT SET");
console.log("EMAIL_PASS:", process.env.SENDER_PASSWORD ? "SET" : "NOT SET");

export default transporter;

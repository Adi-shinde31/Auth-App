import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // false for TLS
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  },
  connectionTimeout: 10000,
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

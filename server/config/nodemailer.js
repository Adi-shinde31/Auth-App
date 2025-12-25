import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
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

export default transporter;

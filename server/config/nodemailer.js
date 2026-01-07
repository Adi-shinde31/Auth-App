import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
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

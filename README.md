# 🛡️ Auth App (MERN Stack)

A full-stack **Authentication & Account Management Application** built with **MERN stack** (MongoDB, Express.js, React, Node.js).  
It features **email verification, password reset, secure JWT-based authentication**, and a clean, responsive frontend interface.

---

## 🚀 Features

### Authentication
- User **Registration** with email verification.
- User **Login** with JWT-based sessions stored in HTTP-only cookies.
- **Logout** functionality.
- **Protected Routes** using middleware to verify JWT tokens.

### Email Verification
- Sends **OTP to user email** upon registration.
- Verifies email with **one-time password** (OTP).
- Tracks OTP expiration and prevents reuse.

### Password Reset
- Sends **OTP to user email** for password reset.
- Allows secure **password update** after OTP validation.

### User Account Management
- Tracks if a user’s account is verified.
- Secure password storage using **bcrypt hashing**.
- Uses **JWT tokens** for authentication.
- Supports **frontend-backend CORS setup** for browser extension and web interface.

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, TailwindCSS, Axios, react-toastify
- **Backend:** Node.js, Express.js, JWT authentication
- **Database:** MongoDB (Atlas)
- **Email:** Nodemailer (Gmail SMTP)
- **Deployment:** Render.com (frontend & backend)

---

## 🏗️ Project Structure

```
backend/
├── config/
│   ├── mongodb.js        # MongoDB connection
│   └── nodemailer.js     # Nodemailer transporter
├── controllers/
│   └── authControllers.js
├── middleware/
│   └── userauth.js       # JWT verification middleware
├── models/
│   └── usermodel.js      # Mongoose user schema
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
└── server.js             # Express server setup
frontend/
├── src/
│   ├── context/
│   ├── pages/
│   ├── components/
│   └── App.jsx
└── package.json
```

---

## ⚡ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Adi-shinde31/AuthApp.git
cd AuthApp
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend root:
```env
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

SENDER_EMAIL=<your_email>
SENDER_PASSWORD=<your_email_password_or_app_password>

NODE_ENV=production

```

Start backend server locally:
```bash
npm run server
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

| Variable            | Description |
|--------------------|-------------|
| `PORT`             | Backend server port |
| `MONGO_URI`        | MongoDB Atlas connection string |
| `JWT_SECRET`       | Secret key for signing JWT tokens |
| `SENDER_EMAIL`     | Email used to send OTPs |
| `SENDER_PASSWORD`  | Email password or App Password |
| `NODE_ENV`         | "production" or "development" |

> **Note:** For Gmail, generate an [App Password](https://support.google.com/accounts/answer/185833) for production.

---

## 🔧 Usage

### Register
- Navigate to `/register`
- Enter name, email, and password
- OTP will be sent to your email

### Email Verification
- Navigate to `/email-verify`
- Enter OTP received via email
- Your account will be marked verified

### Login
- Navigate to `/login`
- Enter email and password
- Upon successful login, JWT stored in HTTP-only cookie

### Password Reset
- Navigate to `/forgot-password`
- Enter your email to receive OTP
- Reset password with OTP verification

### Logout
- Click logout in the NavBar to clear the session cookie

---

## 📦 API Endpoints

| Endpoint                       | Method | Protected | Description |
|--------------------------------|--------|-----------|-------------|
| `/api/auth/register`            | POST   | ❌        | Register new user |
| `/api/auth/login`               | POST   | ❌        | Login user |
| `/api/auth/logout`              | POST   | ✅        | Logout user |
| `/api/auth/send-verify-otp`     | POST   | ✅        | Send email verification OTP |
| `/api/auth/verify-account`      | POST   | ✅        | Verify account with OTP |
| `/api/auth/is-auth`             | GET    | ✅        | Check if user is authenticated |
| `/api/auth/send-reset-otp`      | POST   | ❌        | Send password reset OTP |
| `/api/auth/reset-password`      | POST   | ❌        | Reset user password |

---

## 🚀 Deployment (Render.com)

1. Set up backend and frontend as separate services.
2. Add environment variables in Render dashboard.
3. For backend, make sure to:
   - Enable CORS for frontend origin
   - Use `app.set('trust proxy', 1)` for HTTPS on cloud
4. Deploy both services and connect frontend to backend URL.

---

## ⚠️ Common Issues

### 1. CORS Errors
Ensure your backend allows requests from your frontend:
```js
app.use(cors({
  origin: ['https://your-frontend-url', 'http://localhost:5173'],
  credentials: true
}));
```

### 2. Email Not Sending
- Check SMTP credentials (use App Password for Gmail)
- Verify email sending from backend logs
- Consider using SendGrid / Mailgun for production

### 3. 500 Internal Server Error
- Usually caused by email sending failure
- Check backend logs for `Nodemailer` errors

---

## 📝 Notes
- OTP expires in 24 hours for email verification.
- Reset OTP expires in 15 minutes.
- JWT is stored in HTTP-only cookies for security.
- Passwords are securely hashed using **bcrypt**.

---

## 👨‍💻 Author
Aditya Shinde  
[GitHub](https://github.com/Adi-shinde31) | [LinkedIn](https://www.linkedin.com/in/adi-shinde31/)


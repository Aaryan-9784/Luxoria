# 🚗 LUXORIA — Ultra-Premium Luxury Car Rental Platform

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://mongodb.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=white&style=for-the-badge)](https://razorpay.com)

**A production-ready full-stack MERN platform for luxury car rentals.**  
Three role-based portals · 2-Step OTP Authentication · Razorpay payments · Google OAuth · Enterprise analytics

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start](#-quick-start)
6. [Environment Variables](#-environment-variables)
7. [Database Schema](#-database-schema)
8. [Authentication & Security Flow](#-authentication--security-flow)
9. [Payment Flow](#-payment-flow)
10. [API Reference](#-api-reference)
11. [Development Scripts](#-development-scripts)
12. [Deployment](#-deployment)
13. [Troubleshooting](#-troubleshooting)
14. [Contributing](#-contributing)
15. [License](#-license)

---

## 🌟 Overview

LUXORIA connects high-end car rental vendors with elite customers through a single, unified platform. It features **three completely separate portals** built on one codebase:

| Portal | Who Uses It | What They Can Do |
|---|---|---|
| **User Portal** | Customers | Browse vehicles, create wishlists, verify via 2FA OTP, book & pay online |
| **Vendor Dashboard** | Fleet owners | List vehicles, manage bookings, view earnings & analytics |
| **Admin Panel** | Platform operators | Approve vendors/vehicles, manage users, monitor platform health |

---

## ✨ Key Features

### 🔐 Authentication & 2-Step OTP Security
- **Dual JWT Token System**: 15-min access token + 7-day refresh token with automatic atomic rotation.
- **Two-Factor OTP Verification**: 6-digit email OTP generated via SHA-256 hashing (10-min expiration) during manual credential logins (`/verify-otp`, `/resend-otp`).
- **Seamless 6-Digit Auto-Focus UI**: Dedicated auto-advancing OTP input component (`OtpVerificationModal.jsx`) styled to match the dark luxury design system.
- **Google OAuth 2.0**: Single-click login via Passport.js with automatic Welcome Email dispatch.
- **Refresh Token Reuse Detection**: Replaying a rotated token immediately wipes all active sessions for security.
- **Role-Based Guards**: Separate access controls for `user`, `vendor`, and `admin`.

### 📧 Branded Email System
- Responsive dark-luxury HTML email templates with official Luxoria car branding (`#0F172A` & `#D4AF37`).
- Automated emails for: Welcome Messages (Manual + OAuth), 2FA OTP Codes, Password Resets, and Booking Confirmations.

### 📅 Booking Engine
- Real-time date overlap validation to prevent double bookings.
- Server-side price calculation: `totalDays × pricePerDay`.
- Full booking lifecycle: `pending → confirmed → active → completed → cancelled`.
- Automatic notifications to both vendor and user at every status change.

### 💳 Payments (Razorpay)
- 3-step flow: create order → frontend checkout → HMAC-SHA256 signature verification.
- Refund support via `initiateRefund()` helper.
- Full audit trail with Payment records linked to Bookings.

### 🖼️ Media Management
- Cloudinary v2 integration with **stream-based uploads** (no temporary files saved on disk).
- Multi-image upload support for vehicle listings and review photos.

### 📊 Enterprise Analytics
- **Admin**: 11 parallel MongoDB aggregations — revenue, booking trends, top vendors, fleet distribution.
- **Vendor**: 5 parallel aggregations scoped to their own fleet.

---

## 🏗️ Tech Stack

### Backend

| Category | Technology |
|---|---|
| Framework | Express 4 (ESM modules) |
| Database | MongoDB + Mongoose 8 |
| Authentication | JWT, bcryptjs, Passport.js (Google OAuth 2.0), SHA-256 OTPs |
| Payments | Razorpay SDK |
| File Storage | Cloudinary v2, Multer, Streamifier |
| Email | Nodemailer |
| Validation | Joi 17 |
| Security | Helmet, HPP, express-mongo-sanitize, express-rate-limit |

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| State Management | Redux Toolkit + React-Redux |
| Routing | React Router DOM 7 |
| Forms | React Hook Form 7 |
| HTTP Client | Axios with token refresh interceptors |
| UI Components | Tailwind CSS 4, Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |

---

## 📁 Project Structure

```
LUXORIA/
├── backend/
│   └── src/
│       ├── config/             # DB, Cloudinary, Nodemailer, Passport, Razorpay setup
│       ├── controllers/        # Route handlers (auth, booking, vehicle, vendor, admin)
│       ├── middleware/         # Auth, error handler, rate limiter, validator
│       ├── models/             # Mongoose schemas (User, Vehicle, Booking, Payment, etc.)
│       ├── routes/             # Express routes (auth, booking, vehicle, etc.)
│       ├── services/           # EmailService, PaymentService, AnalyticsService
│       ├── utils/              # ApiError, ApiResponse, ApiFeatures
│       └── validations/        # Joi input schemas (auth, vehicle, booking)
│
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/           # OtpVerificationModal, OAuthCallback
        │   ├── common/         # Navbar, Footer, Sidebar
        │   └── ui/             # Alert, Button, Modal, Card
        ├── pages/
        │   ├── admin/          # AdminOverview, UserManagement, Analytics
        │   ├── public/         # HomePage, LoginPage, RegisterPage, VehicleList
        │   └── vendor/         # VendorOverview, ManageFleet, AddVehicleWizard
        ├── redux/              # Store and Slices (auth, booking, vehicle, ui)
        ├── routes/             # AppRoutes, GuestRoute, ProtectedRoute, RoleRoute
        └── services/           # Axios instance with interceptors
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/luxoria.git
cd luxoria
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT secrets, Nodemailer SMTP, and Razorpay keys
npm run dev
# Backend runs at http://localhost:5000
```

### 3. Set up the frontend

```bash
# Open a new terminal tab
cd frontend
npm install
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:5000/api
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔑 Environment Variables

### `backend/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/luxoria

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# SMTP Email Setup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@luxoria.com
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 🔐 Authentication & Security Flow

```
1. Credentials Submitted (LoginPage / RegisterPage)
   ├── POST /api/auth/login
   └── Server generates 6-digit OTP → Hashes with SHA-256 → Sends branded email

2. OTP Verification (OtpVerificationModal)
   ├── POST /api/auth/verify-otp { email, otp }
   └── On match → Returns accessToken (15m) + Sets refreshToken (7d) httpOnly cookie

3. Google OAuth Flow
   ├── GET /api/auth/google → OAuth Callback → Frontend exchanges session
   └── New OAuth User created → Welcome Email automatically dispatched

4. Token Rotation & Refresh
   └── 401 Unauthorized → Axios Interceptor calls POST /api/auth/refresh
```

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | User credentials login (Triggers 2FA OTP) |
| POST | `/vendor/login` | Public | Vendor credentials login (Triggers 2FA OTP) |
| POST | `/admin/login` | Public | Admin credentials login (Triggers 2FA OTP) |
| POST | `/verify-otp` | Public | Verify 6-digit login OTP code |
| POST | `/resend-otp` | Public | Resend 6-digit login OTP code |
| POST | `/refresh` | Public | Rotate refresh token & return new access token |
| POST | `/logout` | Public | Clear session & refresh cookies |
| GET | `/me` | Protected | Get current user profile |
| GET | `/google` | Public | Initiate Google OAuth 2.0 flow |
| GET | `/google/callback` | Public | Google OAuth 2.0 callback |

---

## 📄 License

Distributed under the MIT License. © 2026 LUXORIA Premium Private Limited.

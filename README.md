# 🚗 LUXORIA — Ultra-Premium Luxury Car Rental Platform

<div align="center">

![LUXORIA Banner](https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![Vite 6](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![Express 4](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://mongodb.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=white&style=for-the-badge)](https://razorpay.com)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**A full-stack enterprise MERN platform for luxury car rentals and fleet management.**  
*Features 3 role-based portals · 2-Step Email OTP Security · Razorpay Payments · Google OAuth 2.0 · Real-time Fleet Overlap Validation · Enterprise Analytics*

</div>

---

## 📋 Table of Contents

- [✨ Project Overview](#-project-overview)
- [🏛️ Architectural System Overview](#️-architectural-system-overview)
- [🌟 Key Feature Highlights](#-key-feature-highlights)
- [📱 Three Dedicated Portals](#-three-dedicated-portals)
- [🛠️ Tech Stack Directory](#️-tech-stack-directory)
- [📁 Project Folder Structure](#-project-folder-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔑 Environment Variables Reference](#-environment-variables-reference)
- [🔐 Security & Authentication Engine](#-security--authentication-engine)
- [💳 Razorpay Payment & Refund Architecture](#-razorpay-payment--refund-architecture)
- [📡 API Endpoint Reference](#-api-endpoint-reference)
- [🚢 Deployment Guide](#-deployment-guide)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Project Overview

**LUXORIA** is an ultra-premium, full-stack luxury car rental marketplace connecting elite customers with verified vehicle vendors and fleet owners across India. Built using modern web engineering principles, Luxoria combines an evocative dark-luxury aesthetic with bank-grade security, automated reservation date checks, Razorpay online payments, and enterprise analytics.

### Why Luxoria?
- **Unified Codebase, Multi-Portal**: Provides dedicated UI experiences for Clients, Fleet Vendors, and Platform Administrators within one unified system.
- **Zero Double-Bookings**: Dynamic date-range overlap algorithm checks vehicle availability before checkout.
- **2-Step Verification (2FA OTP)**: Protects manual credential logins via 6-digit email OTP verification backed by SHA-256 cryptographic hashing.
- **High-Contrast Responsive UI**: Engineered with custom Tailwind CSS tokens, smooth Framer Motion micro-interactions, and accessibility standards.

---

## 🏛️ Architectural System Overview

```
[ CLIENT BROWSER (Vite / React 19 / Redux Toolkit) ]
           │
           │ HTTPS / REST API Calls (Axios Interceptors)
           ▼
[ BACKEND API SERVER (Express 4 / Node.js 18+) ]
     ├── Auth Middleware (JWT Access & HttpOnly Refresh Cookies)
     ├── Validation Layer (Joi Schemas)
     └── Service Layer
           ├── Database: MongoDB Atlas (Mongoose ODM)
           ├── Payments: Razorpay SDK (HMAC-SHA256 Signatures)
           ├── Emails: Nodemailer / SMTP (Responsive HTML Templates)
           ├── Media: Cloudinary v2 (Stream uploads)
           └── Auth: Google OAuth 2.0 (Passport.js)
```

---

## 🌟 Key Feature Highlights

### 🔐 Bank-Grade Authentication & 2FA
- **Dual JWT Architecture**: Short-lived access tokens (15 mins) stored in memory + long-lived HTTP-only refresh tokens (7 days) with atomic rotation.
- **2-Step OTP Security**: Mandatory 6-digit email OTP verification code sent via Nodemailer during manual logins.
- **Google OAuth 2.0**: Single-click social authentication returning secure JWT credentials.
- **Automatic Token Refresh**: Axios interceptors automatically request new access tokens on 401 response codes without interrupting the user.

### 🚘 Fleet & Booking Management Engine
- **Dynamic Overlap Prevention**: Server-side MongoDB query checks existing bookings to block date collisions.
- **Automated Price Calculation**: `Total Amount = totalDays × pricePerDay + Taxes & Deductibles`.
- **Status Lifecycle**: `pending` ➔ `confirmed` ➔ `active` ➔ `completed` (or `cancelled`).
- **Doorstep Concierge & Chauffeur Services**: Integrated support for self-drive or White-Glove Chauffeur services.

### 💳 Razorpay Online Payment Gateway
- **Cryptographic Order Creation**: Server generates order ID with exact price calculation.
- **Frontend SDK Integration**: Opens native Razorpay checkout modal with theme matching.
- **HMAC-SHA256 Verification**: Verifies payment signature server-side before confirming bookings.
- **Automated Refund Tiers**: Integrated cancellation policy (100% refund >48h, 50% refund 24-48h, 0% <24h).

### 📊 Enterprise Real-Time Analytics
- **Admin Dashboard**: 11 parallel MongoDB aggregations tracking total revenue, monthly trends, top-performing vendors, and fleet utilization.
- **Vendor Dashboard**: 5 parallel aggregations displaying fleet earnings, active rentals, and pending approvals.

---

## 📱 Three Dedicated Portals

| Portal | Intended Audience | Core Capabilities |
|---|---|---|
| **User Portal** | Customers / Renters | Browse luxury fleets, apply filters (Sports, Sedan, SUV), build wishlists, 2FA login, Razorpay checkout, manage reservations, leave reviews, view invoices. |
| **Vendor Portal** | Car Owners & Suppliers | Vehicle submission wizard, Cloudinary multi-image upload, booking schedule management, daily rate adjustments, revenue metrics, customer inquiry desk. |
| **Admin Panel** | Platform Governance | Vendor application approvals, vehicle listing audits, user account management, platform-wide analytics, legal compliance enforcement. |

---

## 🛠️ Tech Stack Directory

### Frontend Stack
- **Library**: React 19 (Hooks, Suspense, Lazy Loading)
- **Build Tool**: Vite 6 (Fast HMR & Optimized Chunks)
- **State Management**: Redux Toolkit 2.x + React-Redux
- **Styling**: Tailwind CSS 4 + Custom CSS Design System
- **Animations**: Framer Motion (Page transitions & micro-animations)
- **Icons**: Lucide React
- **HTTP Client**: Axios with Response Interceptors & Request Interlocking
- **Charts**: Recharts (Revenue & booking analytics visualizers)

### Backend Stack
- **Runtime**: Node.js 18+ (ES Modules)
- **Framework**: Express 4
- **Database**: MongoDB Atlas + Mongoose 8 ODM
- **Authentication**: JWT, bcryptjs, Passport.js (Google OAuth 2.0), SHA-256 OTPs
- **Payment Gateway**: Razorpay Node SDK
- **File Storage**: Cloudinary v2 + Multer (Streamifier memory storage)
- **Email Service**: Nodemailer (SMTP email delivery)
- **Input Validation**: Joi 17
- **Security Headers**: Helmet, HPP, Express Rate Limit, Mongo Sanitize

---

## 📁 Project Folder Structure

```
LUXORIA/
├── backend/
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Nodemailer, Passport, Razorpay setup
│   │   ├── controllers/        # Route logic (auth, booking, vehicle, vendor, admin)
│   │   ├── middleware/         # Auth verification, error handler, rate limiters
│   │   ├── models/             # Mongoose schemas (User, Vehicle, Booking, Payment, Notification)
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # EmailService, PaymentService, AnalyticsService
│   │   ├── utils/              # ApiError, ApiResponse, AsyncHandler
│   │   └── validations/        # Joi validation schemas
│   └── package.json
│
└── frontend/
    ├── public/                 # Static images, favicon, local luxury assets
    ├── src/
    │   ├── components/         # Reusable UI components (Navbar, Footer, Modals)
    │   ├── pages/
    │   │   ├── admin/          # AdminOverview, UserManagement, VehicleApprovals
    │   │   ├── public/         # HomePage, VehiclesPage, TermsPage, PrivacyPage, CookiePage
    │   │   ├── user/           # UserProfile, MyBookings, UserInvoices
    │   │   └── vendor/         # VendorOverview, AddVehicleWizard, ManageFleet
    │   ├── redux/              # Redux slices (authSlice, vehicleSlice, bookingSlice)
    │   ├── routes/             # AppRoutes, ProtectedRoute, RoleRoute
    │   ├── sections/           # Modular homepage sections & luxury testimonials
    │   └── services/           # Axios instance & API caller helpers
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas**: Active cluster URI or local MongoDB daemon instance
- **Razorpay Account**: Test Key ID and Secret for payment authorization

---

### Step 1: Clone Repository

```bash
git clone https://github.com/Aaryan-9784/Luxoria.git
cd Luxoria
```

---

### Step 2: Configure & Start Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

*Configure your `backend/.env` file (refer to Environment Variables below).*

```bash
# Start backend server in development mode
npm run dev
```
> 🚀 **Backend Server running at:** `http://localhost:5000`

---

### Step 3: Configure & Start Frontend

```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

*Configure your `frontend/.env` file:*
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

```bash
# Start frontend development server
npm run dev
```
> 🌐 **Frontend Application running at:** `http://localhost:5173`

---

## 🔑 Environment Variables Reference

### `backend/.env`

```env
# Application Settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxoria?retryWrites=true&w=majority

# JWT Token Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Storage Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM=noreply@luxoria.com
```

---

## 🔐 Security & Authentication Engine

### 2-Step OTP Authentication Flow
1. User enters email & password on login form (`/api/auth/login`).
2. Server verifies password hash (bcrypt).
3. Server generates a random 6-digit OTP, computes SHA-256 hash, and saves it in MongoDB with a **10-minute expiration**.
4. Server emails the plain 6-digit OTP code to the user via Nodemailer using a branded HTML template.
5. Client opens `OtpVerificationModal.jsx`. User inputs 6 digits.
6. Server verifies OTP (`/api/auth/verify-otp`), issues JWT access token, and sets HTTP-only refresh cookie.

---

## 💳 Razorpay Payment & Refund Architecture

1. **Order Initiation**: Client selects vehicle dates and clicks "Reserve & Pay".
2. **Backend Order Creation**: POST request to `/api/payments/create-order` calculates total price and generates Razorpay Order ID.
3. **Frontend SDK Execution**: Razorpay modal opens. User enters test payment credentials.
4. **Signature Verification**: Server verifies HMAC-SHA256 signature (`razorpay_order_id|razorpay_payment_id`).
5. **Confirmation & Receipt**: Booking updates to `confirmed` status, notification sent, and PDF/HTML receipt generated.

---

## 📡 API Endpoint Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new client account |
| `POST` | `/login` | Public | Submit credentials & trigger 2FA OTP |
| `POST` | `/verify-otp` | Public | Verify 6-digit login OTP code |
| `POST` | `/resend-otp` | Public | Resend 6-digit login OTP code |
| `POST` | `/refresh` | Public | Rotate refresh token for new access token |
| `POST` | `/logout` | Public | Clear HTTP-only session cookies |
| `GET` | `/me` | Protected | Fetch authenticated user profile |
| `GET` | `/google` | Public | Initiate Google OAuth 2.0 flow |

### 🚗 Vehicles (`/api/vehicles`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Search and filter active luxury vehicles |
| `GET` | `/:id` | Public | Get detailed vehicle specifications & photos |
| `POST` | `/` | Vendor | Submit a new vehicle for admin approval |
| `PUT` | `/:id` | Vendor / Admin | Update vehicle details or daily rate |
| `DELETE` | `/:id` | Vendor / Admin | Delist vehicle from marketplace |

### 📅 Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Protected | Create booking reservation request |
| `GET` | `/my-bookings` | Protected | List logged-in user's booking history |
| `GET` | `/vendor-bookings` | Vendor | List bookings for vendor's fleet |
| `PATCH` | `/:id/status` | Vendor / Admin | Update booking status (`confirmed`, `cancelled`) |

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Connect GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build` | Output Directory: `dist`.
4. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend production URL.
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay live/test key ID.

### Deploying Backend to Render / Railway
1. Connect GitHub repository to Render / Railway.
2. Set Root Directory to `backend`.
3. Build Command: `npm install` | Start Command: `node src/server.js`.
4. Add Environment Variables from `backend/.env`.

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Aaryan-9784/Luxoria/issues).

Distributed under the **MIT License**.  
© 2026 **LUXORIA Premium Private Limited**. All Rights Reserved.

**Contact Legal & Developer Support**: [aaryanpatel9784@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Developer%20Support) | +91 82380 12515

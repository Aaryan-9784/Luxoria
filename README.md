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
Three role-based portals · Razorpay payments · Google OAuth · Enterprise analytics

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start](#-quick-start)
6. [Environment Variables](#-environment-variables)
7. [Database Schema](#-database-schema)
8. [Authentication Flow](#-authentication-flow)
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
| **User Portal** | Customers | Browse vehicles, create wishlists, book & pay online |
| **Vendor Dashboard** | Fleet owners | List vehicles, manage bookings, view earnings & analytics |
| **Admin Panel** | Platform operators | Approve vendors/vehicles, manage users, monitor platform health |

---

## ✨ Features

### 🔐 Authentication & Security
- Dual JWT token system — 15-min access token + 7-day refresh token with automatic rotation
- Refresh token **reuse detection** — replaying a rotated token immediately wipes all active sessions
- Google OAuth 2.0 via Passport.js with account linking support
- Separate login portals for users, vendors, and admins
- 3-tier rate limiting, Helmet headers, HPP protection, and NoSQL injection prevention

### 📅 Booking Engine
- Real-time date overlap validation to prevent double bookings
- Server-side price calculation: `totalDays × pricePerDay`
- Full booking lifecycle: `pending → confirmed → active → completed → cancelled`
- Automatic notifications to both vendor and user at every status change

### 💳 Payments (Razorpay)
- 3-step flow: create order → frontend checkout → HMAC-SHA256 signature verification
- Refund support via `initiateRefund()` helper
- Full audit trail with Payment records linked to Bookings

### 🖼️ Media Management
- Cloudinary v2 integration with **stream-based uploads** (no temp files on disk)
- Multi-image support for vehicle listings and review photos

### 📊 Analytics
- **Admin**: 11 parallel MongoDB aggregations — revenue, booking trends, top vendors, fleet distribution
- **Vendor**: 5 parallel aggregations scoped to their own fleet

### 🛠️ Additional Modules
- Wishlists, Reviews (with auto-recalculated vehicle ratings)
- Notifications with 90-day auto-expiry (MongoDB TTL index)
- Concierge requests, Newsletter subscriptions, Contact form
- Master data CMS for brands, cities, and vehicle features

---

## 🏗️ Tech Stack

### Backend

| Category | Technology |
|---|---|
| Framework | Express 4 (ESM modules) |
| Database | MongoDB + Mongoose 8 |
| Authentication | JWT 9, bcryptjs, Passport + Google OAuth 2.0 |
| Payments | Razorpay 2.9 |
| File Storage | Cloudinary 2, Multer, Streamifier |
| Email | Nodemailer 6 |
| Validation | Joi 17 |
| Security | Helmet 7, HPP, express-mongo-sanitize, express-rate-limit 7 |
| Logging | Morgan |
| Deployment | Render (render.yaml) |

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| State Management | Redux Toolkit 2 + React-Redux 9 |
| Routing | React Router DOM 7 |
| Forms | React Hook Form 7 |
| HTTP Client | Axios 1.7 with custom interceptors |
| UI Components | shadcn/ui (New York theme) + Tailwind CSS 4 |
| Icons | Lucide React |
| Animations | Framer Motion 11 |
| Charts | Recharts 3 |
| Payments | Razorpay checkout.js (loaded via CDN) |

---

## 📁 Project Structure

```
LUXORIA/
├── backend/
│   └── src/
│       ├── config/             # DB, Cloudinary, Nodemailer, Passport, Razorpay setup
│       ├── constants/          # App-wide constants
│       ├── controllers/        # Route handler logic (12 controllers)
│       ├── middleware/         # Auth, error handler, rate limiter, upload, validator
│       ├── models/             # Mongoose models (10 schemas)
│       ├── routes/             # Express route definitions (12 modules)
│       ├── scripts/            # Seed scripts and DB utilities
│       ├── services/           # Business logic (auth, email, payment, upload, analytics)
│       ├── utils/              # ApiError, ApiResponse, ApiFeatures, generateId
│       ├── validations/        # Joi schemas for all major inputs
│       ├── app.js              # Express app factory (routes, middleware, error handler)
│       └── server.js           # HTTP server startup + graceful shutdown
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/         # Navbar, Footer, Sidebar, ScrollToTop
        │   ├── sections/       # 40+ reusable page sections
        │   └── ui/             # Button, Modal, Badge, DataTable, Alert, etc.
        ├── layouts/            # Main, Dashboard, Vendor, and Admin layout wrappers
        ├── pages/
        │   ├── admin/          # AdminOverview, UserManagement, Analytics, etc.
        │   ├── public/         # HomePage, Login, Register, Vehicle Collection
        │   ├── user/           # Dashboard, Bookings, Wishlist, Payments
        │   ├── vehicles/       # VehicleList, VehicleDetails
        │   └── vendor/         # VendorOverview, ManageFleet, AddVehicleWizard
        ├── redux/
        │   ├── store.js
        │   └── slices/         # auth, booking, vehicle, vendor, admin, notification, ui
        ├── routes/             # AppRoutes, ProtectedRoute, GuestRoute, RoleRoute
        ├── services/           # Axios instance with token refresh interceptor
        ├── hooks/              # Custom React hooks
        └── lib/                # Utility helpers
```

---

## 🚀 Quick Start

> **Prerequisites:** Node.js v18+, a MongoDB Atlas cluster, Cloudinary account, Razorpay account (test mode works)

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
# Open .env and fill in your credentials
npm run dev
# API runs at http://localhost:5000
```

### 3. Set up the frontend

```bash
# Open a new terminal tab
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# App runs at http://localhost:5173
```

### 4. Seed sample data (optional)

```bash
cd backend
node src/scripts/seed.js    # Seed vehicles and master data
node seed_admin.js           # Create default admin account
node seedConcierge.js        # Seed sample concierge requests
```

### 5. Open the app

Visit [http://localhost:5173](http://localhost:5173)

**Default test accounts:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@luxoria.com | Demo@123 |
| Vendor | vendor@luxoria.com | Demo@123 |
| User | user@luxoria.com | Demo@123 |

---

## 🔑 Environment Variables

### `backend/.env`

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/luxoria

# JWT Secrets (use 32+ character random strings)
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

# Email (SMTP — Mailtrap works for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@luxoria.com
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 🗄️ Database Schema

### User
```
name, email (unique), password (bcrypt, hidden in responses), phone
avatar: { url, publicId }
role: 'user' | 'vendor' | 'admin'
googleId (sparse unique index)
isVerified, isActive
refreshTokens: [{ token, expiresAt, createdAt }]
address: { street, city, state, zip, country }
passwordResetToken, passwordResetExpires
```

### Vehicle
```
vendor → User, name, slug (sparse unique), brand, model, year
category: sedan | suv | sports | luxury | convertible | limousine | electric
transmission: automatic | manual
fuelType: petrol | diesel | electric | hybrid
seats, pricePerDay
images: [{ url, publicId }]
features: [String], description
location: { city, state, address, coordinates }  ← 2dsphere indexed
availability: available | booked | maintenance
status: pending | approved | rejected
rating: { average, count }
isActive
```

### Booking
```
user → User, vehicle → Vehicle, vendor → User
bookingId: "LUX-XXXXXXXX" (auto-generated)
startDate, endDate, totalDays (auto-calculated), totalAmount
status: pending | confirmed | active | completed | cancelled
pickupLocation, dropoffLocation, notes, cancellationReason
```

### Payment
```
booking → Booking, user → User
razorpayOrderId (unique), razorpayPaymentId (sparse unique), razorpaySignature
amount, currency (INR)
status: created | authorized | captured | refunded | failed
method, refundId, refundAmount
```

### Other Models

| Model | Key Fields |
|---|---|
| Review | user, vehicle, booking, rating (1–5), comment, images[] |
| Wishlist | user + vehicle (unique compound index) |
| Notification | recipient, type, title, message, isRead — TTL 90 days |
| ConciergeRequest | clientName, requestId, type, status, priority (low/medium/high) |
| MasterData | category (brand/city/feature/vehicleType/faq), label, value, icon |
| Newsletter | email (unique), subscribedAt, isActive |

---

## 🔐 Authentication Flow

```
Register / Login
  ├── Returns accessToken (15 min) in response body
  └── Sets refreshToken (7 days) as httpOnly cookie
        └── Also stored in User.refreshTokens[] in MongoDB

Authenticated Request
  └── Axios attaches:  Authorization: Bearer <accessToken>

Token Expires (401 received)
  ├── Axios interceptor calls POST /api/auth/refresh
  ├── Backend does atomic token rotation via findOneAndUpdate
  │     └── Old token not found? → reuse detected → all sessions wiped
  ├── Concurrent 401s are queued and replayed after refresh
  └── Refresh fails? → Redux logout dispatched automatically

Page Load / Session Restore
  └── AppRoutes calls POST /auth/refresh → GET /auth/me → hydrates Redux state

Google OAuth Flow
  └── GET /api/auth/google → callback → redirect to /oauth-callback
        └── OAuthCallback component exchanges cookie for accessToken

Password Reset
  └── 32-byte crypto token, SHA-256 hashed in DB, 10-min expiry
        └── On successful reset → all refresh tokens cleared
```

---

## 💳 Payment Flow

```
Step 1 — Create Order
  POST /api/payments/create-order
  └── Creates a Razorpay order (amount in paise)
      Creates a Payment record with status "created"
      Returns { orderId, amount, currency, key }

Step 2 — User Pays
  Frontend opens Razorpay modal (checkout.js from CDN)
  └── User completes payment
      Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }

Step 3 — Verify Signature
  POST /api/payments/verify
  └── HMAC-SHA256 check: sha256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
      Valid? → Payment.status = "captured", Booking.status = "confirmed"
              → Sends booking confirmation email (non-blocking)
```

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <accessToken>`.

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | User login |
| POST | `/vendor/login` | Public | Vendor login |
| POST | `/admin/login` | Public | Admin login |
| POST | `/refresh` | Public | Rotate refresh token |
| POST | `/logout` | Public | Clear session |
| GET | `/me` | Protected | Get current user |
| POST | `/forgot-password` | Public | Send password reset email |
| PUT | `/reset-password/:token` | Public | Reset password with token |
| GET | `/google` | Public | Initiate Google OAuth |
| GET | `/google/callback` | Public | Google OAuth callback |

### Vehicles — `/api/vehicles`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List vehicles (with filter, search, pagination) |
| GET | `/:id` | Public | Get vehicle details |
| POST | `/` | Vendor | Create a vehicle listing |
| PUT | `/:id` | Vendor | Update vehicle details |
| DELETE | `/:id` | Vendor | Delete vehicle |
| POST | `/:id/images` | Vendor | Upload vehicle images |

### Bookings — `/api/bookings`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Create a booking |
| GET | `/my` | User | Get current user's bookings |
| GET | `/vendor` | Vendor | Get all bookings for vendor's fleet |
| GET | `/:id` | Protected | Get booking details |
| PUT | `/:id/status` | Vendor/Admin | Update booking status |
| PUT | `/:id/cancel` | User | Cancel a booking |

### Payments — `/api/payments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-order` | User | Create Razorpay order |
| POST | `/verify` | User | Verify payment signature |
| GET | `/:bookingId` | Protected | Get payment details |

### Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id/status` | Admin | Activate or deactivate user |
| GET | `/vendors` | Admin | List all vendors |
| PUT | `/vendors/:id/approve` | Admin | Approve or reject vendor |
| GET | `/vehicles` | Admin | List all vehicles |
| PUT | `/vehicles/:id/approve` | Admin | Approve or reject vehicle |
| DELETE | `/vehicles/:id` | Admin | Delete a vehicle |
| GET | `/bookings` | Admin | List all bookings |
| GET | `/analytics` | Admin | Get dashboard analytics |
| GET | `/concierge` | Admin | List concierge requests |
| PUT | `/concierge/:id/status` | Admin | Update concierge request status |

### Other Routes

| Prefix | Purpose |
|---|---|
| `/api/users` | Profile management, avatar upload, password change |
| `/api/wishlist` | Add, remove, and list wishlist items |
| `/api/reviews` | Create, read, and delete reviews |
| `/api/notifications` | List, mark as read, and clear notifications |
| `/api/master-data` | Reference data (brands, cities, vehicle features) |
| `/api/contact` | Submit a contact form message |
| `/api/newsletter` | Subscribe and unsubscribe |

---

## 🧰 Development Scripts

### Backend

```bash
cd backend

npm run dev              # Start dev server with auto-reload (nodemon)
npm start                # Start production server

# Seed database
node src/scripts/seed.js           # Seed vehicles + master data
node seed_admin.js                 # Create default admin (admin@luxoria.com / Demo@123)
node seedConcierge.js              # Seed sample concierge requests

# Debug & verify
node check_db.js                   # Verify MongoDB connection
node check_bookings.js             # Inspect current booking states
node test_auth_flow.js             # Test the full auth flow
node test_oauth.js                 # Test Google OAuth
node test_filter.js                # Test vehicle filtering logic
```

### Frontend

```bash
cd frontend

npm run dev              # Start Vite dev server with HMR
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview the production build locally
npm run lint             # Run ESLint
```

---

## 🚢 Deployment

### Frontend — Vercel / Netlify

```bash
cd frontend
npm run build            # Builds to frontend/dist/
```

Set `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID` in your hosting dashboard. Both Vercel and Netlify handle SPA routing automatically.

### Backend — Render

A `render.yaml` Blueprint is included for zero-config deployment:

1. Push to GitHub
2. Connect your repo in the [Render Dashboard](https://dashboard.render.com)
3. Add all backend `.env` variables in the Render environment settings
4. Render reads `render.yaml` and deploys automatically

For other providers (Railway, Fly.io):

```bash
cd backend
npm start                # Use this as your start command
```

---

## 🏛️ Architecture Notes

**Refresh Token Rotation**
Token rotation uses `findOneAndUpdate` to atomically match the specific token in `User.refreshTokens[]`. If a rotated token is replayed (e.g., stolen token scenario), all sessions for that user are immediately wiped.

**`injectStore()` Pattern**
The Axios instance reads the access token from Redux store. To avoid a circular dependency between `store.js` and `api.js`, the store is injected post-initialization via `injectStore()`.

**`ApiFeatures` Query Builder**
A chainable Mongoose wrapper used across all list endpoints: `.search().filter().sort().selectFields().paginate()`. Keeps controllers lean and the behavior consistent.

**Parallel Analytics**
Admin and vendor analytics run via `Promise.all()` with MongoDB aggregation pipelines — no N+1 queries, no client-side computation.

**Non-Blocking Emails**
All `emailService` calls use `.catch(() => {})` so SMTP failures never interrupt booking or payment flows.

**Notification TTL**
MongoDB's native TTL index on `Notification.createdAt` handles 90-day auto-deletion. No cron jobs needed.

**Geospatial Ready**
`2dsphere` index on `Vehicle.location.coordinates` is set up for future radius and nearest-vehicle search features.

---

## 🐛 Troubleshooting

### Backend

| Error | Likely Cause | Fix |
|---|---|---|
| `connect ECONNREFUSED 127.0.0.1:27017` | MongoDB not running | Check `MONGO_URI` in `.env`, run `node check_db.js` |
| `MongoError: authentication failed` | Wrong DB credentials | Verify username, password, and cluster in `MONGO_URI` |
| `Port 5000 already in use` | Another process on port 5000 | Run `netstat -ano \| findstr :5000` (Windows) and kill the process |
| `Invalid Razorpay credentials` | Wrong or expired API keys | Regenerate keys in [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `Cloudinary upload fails` | Wrong Cloudinary credentials | Verify all three Cloudinary env vars |
| `Google OAuth not working` | Callback URL mismatch | Make sure `GOOGLE_CALLBACK_URL` in `.env` exactly matches Google Cloud Console |

### Frontend

| Error | Likely Cause | Fix |
|---|---|---|
| `CORS error` | `CLIENT_URL` mismatch | Set `CLIENT_URL=http://localhost:5173` in backend `.env` |
| Infinite 401 / token refresh loop | Expired or corrupt refresh token | Clear browser cookies, log in again |
| Redux state lost on refresh | Session restore failing | Test `POST /api/auth/refresh` and `GET /api/auth/me` in Postman |
| Tailwind styles missing in production | PurgeCSS removing dynamic classes | Add dynamic class names to Tailwind safelist in `vite.config.js` |

### Common Setup Mistakes

| Symptom | Root Cause | Fix |
|---|---|---|
| `.env` variables are `undefined` | `.env` file not created | Copy `.env.example` → `.env` and fill in all values |
| Auth fails consistently | JWT secrets too short | Use 32+ character random strings |
| Booking creation fails | Wrong date format | Dates must be in `YYYY-MM-DD` format |
| Emails not sending | Wrong SMTP config | Use [Mailtrap](https://mailtrap.io) for local testing |

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with a clear message: `git commit -m 'feat: add your feature'`
4. Push your branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please follow the existing code style — ESM imports, async/await throughout, and use `ApiError` / `ApiResponse` for all API responses.

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  Built with the MERN stack &nbsp;·&nbsp; Deployed on Render &nbsp;·&nbsp; © 2026 LUXORIA
</div>

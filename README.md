<div align="center">

# 🏎️ LUXORIA

### Ultra-Premium Luxury Car Rental Platform

**Developed by [Aryan Patel](https://github.com/Aaryan-9784)**

<br />

![LUXORIA Banner](https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200)

<br />

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

*3 Role-Based Portals · 2-Step Email OTP Security · Razorpay Payments · Google OAuth 2.0*
*Real-Time Fleet Overlap Validation · Enterprise Analytics · Concierge Services*

[Getting Started](#-quick-start-guide) · [API Reference](#-api-endpoint-reference) · [Deployment](#-deployment-guide) · [Contributing](#-contributing--license)

</div>

---

## 📋 Table of Contents

- [✨ Project Overview](#-project-overview)
- [🏛️ System Architecture](#️-system-architecture)
- [🌟 Key Feature Highlights](#-key-feature-highlights)
- [📱 Three Dedicated Portals](#-three-dedicated-portals)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗄️ Database Schemas](#️-database-schemas)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔑 Environment Variables](#-environment-variables)
- [🔐 Security & Authentication](#-security--authentication)
- [💳 Payment & Refund Architecture](#-payment--refund-architecture)
- [📡 API Endpoint Reference](#-api-endpoint-reference)
- [🚢 Deployment Guide](#-deployment-guide)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Project Overview

**LUXORIA** is an ultra-premium, full-stack luxury car rental marketplace connecting elite customers with verified vehicle vendors and fleet owners across India. Built with the MERN stack and modern web engineering principles, Luxoria combines an evocative dark-luxury aesthetic with bank-grade security, automated reservation checks, Razorpay online payments, and enterprise analytics.

### Why Luxoria?

| Feature | Description |
|---------|-------------|
| **Multi-Portal System** | Dedicated UI experiences for Clients, Fleet Vendors, and Platform Administrators — all within one unified codebase |
| **Zero Double-Bookings** | Dynamic date-range overlap algorithm checks vehicle availability server-side before checkout |
| **2-Step Verification (2FA)** | Manual credential logins protected via 6-digit email OTP verification backed by SHA-256 cryptographic hashing |
| **Concierge & Chauffeur** | Integrated doorstep concierge and white-glove chauffeur service request management |
| **High-Contrast UI** | Engineered with custom Tailwind CSS tokens, Framer Motion micro-interactions, and accessibility standards |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                                   │
│          Vite 6  ·  React 19  ·  Redux Toolkit 2.x                 │
│          Framer Motion  ·  Recharts  ·  Lucide Icons               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    HTTPS / REST API
                   (Axios Interceptors)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                                │
│                Express 4  ·  Node.js 18+                            │
│                                                                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   Auth      │  │  Validation  │  │  Rate Limit  │                │
│  │ Middleware  │  │  Layer (Joi) │  │  & Security  │                │
│  │ (JWT+RBAC) │  │              │  │  (Helmet)    │                │
│  └──────┬─────┘  └──────┬───────┘  └──────┬───────┘                │
│         └───────────┬────┘               ──┘                        │
│                     ▼                                               │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                   SERVICE LAYER                           │       │
│  │                                                           │       │
│  │  📦 MongoDB Atlas (Mongoose 8 ODM)                        │       │
│  │  💳 Razorpay SDK (HMAC-SHA256 Signatures)                 │       │
│  │  📧 Nodemailer SMTP (Branded HTML Templates)              │       │
│  │  🖼️ Cloudinary v2 (Stream Uploads via Multer)             │       │
│  │  🔑 Passport.js (Google OAuth 2.0)                        │       │
│  └──────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Feature Highlights

### 🔐 Bank-Grade Authentication & 2FA

- **Dual JWT Architecture** — Short-lived access tokens (15 min) in memory + long-lived HTTP-only refresh tokens (7 days) with atomic rotation
- **2-Step OTP Security** — Mandatory 6-digit email OTP during manual logins, SHA-256 hashed with 10-minute expiry
- **Google OAuth 2.0** — Single-click social authentication via Passport.js returning secure JWT credentials
- **Password Recovery** — Forgot password flow with email-based reset tokens
- **Automatic Token Refresh** — Axios interceptors silently request new access tokens on 401 responses
- **Role-Based Access Control** — `user`, `vendor`, and `admin` roles with middleware-enforced route protection

### 🚘 Fleet & Booking Management Engine

- **Dynamic Overlap Prevention** — Server-side MongoDB query blocks date collisions in real-time
- **Automated Price Calculation** — `Total = totalDays × pricePerDay + Taxes & Deductibles`
- **Booking Status Lifecycle** — `pending` → `confirmed` → `active` → `completed` (or `cancelled`)
- **Vendor Fleet Management** — Add, edit, delete vehicles with multi-image Cloudinary uploads
- **Availability Calendar** — Visual date-based vehicle availability tracking for vendors
- **Concierge Service Requests** — Doorstep delivery and white-glove chauffeur booking integration

### 💳 Razorpay Online Payment Gateway

- **Cryptographic Order Creation** — Server generates Razorpay Order ID with exact price calculation
- **Frontend SDK Integration** — Native Razorpay checkout modal with branded theme
- **HMAC-SHA256 Verification** — Server verifies payment signature before confirming bookings
- **Automated Refund Tiers** — Tiered cancellation policy: 100% refund >48h, 50% refund 24–48h, 0% <24h

### 📊 Enterprise Real-Time Analytics

- **Admin Dashboard** — 11 parallel MongoDB aggregations: total revenue, monthly trends, top vendors, fleet utilization
- **Vendor Dashboard** — 5 parallel aggregations: fleet earnings, active rentals, revenue breakdowns, booking trends
- **User Dashboard** — Personal booking history, spending summaries, payment tracking, invoice generation

### ⭐ Reviews, Wishlists & Notifications

- **Vehicle Reviews** — Users can create, edit, and delete reviews for rented vehicles
- **Wishlist System** — Save favorite vehicles for quick access
- **Real-Time Notifications** — SSE-powered notification streaming with read/unread management
- **Newsletter Subscriptions** — Email newsletter signup for marketing engagement

---

## 📱 Three Dedicated Portals

### 👤 User Portal — *Customers & Renters*

| Page | Capabilities |
|------|-------------|
| Dashboard Overview | Booking summaries, spending stats, recent activity |
| Browse & Filter Vehicles | Sports, Sedan, SUV categories with advanced filtering |
| Vehicle Details & Booking | Photo gallery, specs, date picker, Razorpay checkout |
| My Bookings | Reservation history, status tracking, cancellation |
| Payments Dashboard | Transaction history, payment breakdowns |
| Invoices | Downloadable PDF/HTML booking invoices |
| Profile Management | Avatar upload, personal info, password changes |
| Reviews & Ratings | Write and manage vehicle reviews |
| Wishlist | Save and manage favorite vehicles |
| Notifications | Real-time alerts for booking updates |
| Support | Submit support tickets to platform admin |

### 🏢 Vendor Portal — *Car Owners & Fleet Suppliers*

| Page | Capabilities |
|------|-------------|
| Vendor Overview | Fleet performance snapshot, pending actions |
| Add Vehicle Wizard | Multi-step vehicle submission with Cloudinary image upload |
| Edit Vehicle Wizard | Modify existing vehicle details and media |
| Manage Fleet | Complete fleet listing with status management |
| Vendor Bookings | Incoming booking requests, approval/rejection |
| Availability Calendar | Visual date-based vehicle availability management |
| Revenue Analytics | Earnings breakdown, payout tracking |
| Advanced Analytics | Detailed performance charts and trends |
| Support | Vendor-specific support ticket system |

### 🛡️ Admin Panel — *Platform Governance*

| Page | Capabilities |
|------|-------------|
| Admin Overview | Platform-wide KPIs and real-time metrics |
| User Management | Account oversight, status updates (active/banned) |
| Vendor Management | Vendor applications, approval/rejection workflows |
| Fleet Approvals | Vehicle listing audits and approval pipeline |
| Booking Management | Platform-wide booking oversight and status control |
| Collections Management | Curated vehicle collections and featured listings |
| Concierge Requests | Manage doorstep delivery and chauffeur requests |
| Analytics Dashboard | Enterprise revenue charts, trend analysis, top performers |
| Calendar View | Platform-wide booking calendar overview |

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Library** | React 19 | UI with Hooks, Suspense, Lazy Loading |
| **Build Tool** | Vite 6 | Fast HMR, optimized production chunks |
| **State Management** | Redux Toolkit 2.x + React-Redux 9 | Global state with async thunks |
| **Styling** | Tailwind CSS 4 + Custom CSS Design System | Utility-first with design tokens |
| **Animations** | Framer Motion 11 | Page transitions & micro-interactions |
| **Icons** | Lucide React | Consistent icon library |
| **Forms** | React Hook Form 7 | Performant form validation |
| **HTTP Client** | Axios | Interceptors & request interlocking |
| **Charts** | Recharts 3 | Revenue & booking analytics |
| **Routing** | React Router DOM 7 | Client-side routing & guards |
| **PDF Generation** | jsPDF 4 | Client-side invoice PDF generation |
| **Utilities** | clsx, tailwind-merge | Conditional classname merging |

### Backend

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js 18+ (ES Modules) | Server-side JavaScript |
| **Framework** | Express 4 | RESTful API routing |
| **Database** | MongoDB Atlas + Mongoose 8 | Document storage & ODM |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Token-based auth & password hashing |
| **OAuth** | Passport.js + passport-google-oauth20 | Google social login |
| **Payments** | Razorpay Node SDK | Order creation & signature verification |
| **File Storage** | Cloudinary v2 + Multer + Streamifier | Cloud image upload pipeline |
| **Email** | Nodemailer | SMTP email delivery with HTML templates |
| **Validation** | Joi 17 | Request schema validation |
| **Security** | Helmet, HPP, express-rate-limit, express-mongo-sanitize | Headers, query protection, rate limiting, NoSQL injection prevention |
| **Logging** | Morgan | HTTP request logging |

---

## 🗄️ Database Schemas

| Model | File | Description |
|-------|------|-------------|
| **User** | `User.js` | Accounts with roles (`user`, `vendor`, `admin`), profile data, OAuth flags, OTP tracking, password reset tokens |
| **Vehicle** | `Vehicle.js` | Fleet listings with specs, pricing, images (Cloudinary), approval status, vendor reference, slug |
| **Booking** | `Booking.js` | Reservations linking users to vehicles with date ranges, status lifecycle, pricing, cancellation reasons |
| **Payment** | `Payment.js` | Razorpay transaction records with order IDs, payment IDs, signatures, amounts, refund tracking |
| **Review** | `Review.js` | User vehicle reviews with ratings, comments, edit history |
| **Wishlist** | `Wishlist.js` | User-to-vehicle saved favorites |
| **Notification** | `Notification.js` | System alerts for booking updates, approvals, and admin communications |
| **ConciergeRequest** | `ConciergeRequest.js` | Doorstep delivery and chauffeur service requests with status tracking |
| **Newsletter** | `Newsletter.js` | Email newsletter subscriptions |
| **MasterData** | `MasterData.js` | Configurable lookup data by category (vehicle types, brands, etc.) |

---

## 📁 Project Structure

```
LUXORIA/
├── README.md
├── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── app.js                     # Express app setup, middleware, route mounting
│   │   ├── server.js                  # Server bootstrap, DB connection, port binding
│   │   │
│   │   ├── config/                    # Service configurations
│   │   │   ├── db.js                  #   MongoDB Atlas connection
│   │   │   ├── cloudinary.js          #   Cloudinary SDK setup
│   │   │   ├── mail.js                #   Nodemailer SMTP transport
│   │   │   ├── passport.js            #   Google OAuth 2.0 strategy
│   │   │   └── razorpay.js            #   Razorpay client instance
│   │   │
│   │   ├── constants/                 # Application-wide constants
│   │   │   └── index.js               #   Booking statuses, roles, limits
│   │   │
│   │   ├── controllers/               # Route handler logic
│   │   │   ├── authController.js      #   Register, login, OTP, OAuth, password reset
│   │   │   ├── userController.js      #   Profile CRUD, avatar management
│   │   │   ├── vehicleController.js   #   Vehicle CRUD, image management
│   │   │   ├── bookingController.js   #   Booking lifecycle management
│   │   │   ├── paymentController.js   #   Razorpay order & verification
│   │   │   ├── adminController.js     #   User/vendor/vehicle/booking admin ops
│   │   │   ├── reviewController.js    #   Vehicle review CRUD
│   │   │   ├── wishlistController.js  #   Wishlist add/remove/list
│   │   │   ├── notificationController.js  # Notification CRUD & SSE stream
│   │   │   ├── contactController.js   #   Contact form & support tickets
│   │   │   ├── newsletterController.js #  Newsletter subscription
│   │   │   └── masterDataController.js #  Lookup data management
│   │   │
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.js                #   JWT verification, role authorization
│   │   │   ├── errorHandler.js        #   Global error handler
│   │   │   ├── rateLimiter.js         #   Rate limiting configurations
│   │   │   ├── upload.js              #   Multer file upload config
│   │   │   ├── validate.js            #   Joi schema validation wrapper
│   │   │   └── asyncHandler.js        #   Async error catch wrapper
│   │   │
│   │   ├── models/                    # Mongoose schemas
│   │   │   ├── User.js                #   User accounts & auth
│   │   │   ├── Vehicle.js             #   Fleet vehicle listings
│   │   │   ├── Booking.js             #   Rental reservations
│   │   │   ├── Payment.js             #   Payment transactions
│   │   │   ├── Review.js              #   Vehicle reviews & ratings
│   │   │   ├── Wishlist.js            #   User wishlists
│   │   │   ├── Notification.js        #   System notifications
│   │   │   ├── ConciergeRequest.js    #   Concierge service requests
│   │   │   ├── Newsletter.js          #   Newsletter subscriptions
│   │   │   └── MasterData.js          #   Configurable lookup data
│   │   │
│   │   ├── routes/                    # Express route definitions
│   │   │   ├── authRoutes.js          #   /api/auth/*
│   │   │   ├── userRoutes.js          #   /api/users/*
│   │   │   ├── vehicleRoutes.js       #   /api/vehicles/*
│   │   │   ├── bookingRoutes.js       #   /api/bookings/*
│   │   │   ├── paymentRoutes.js       #   /api/payments/*
│   │   │   ├── adminRoutes.js         #   /api/admin/*
│   │   │   ├── reviewRoutes.js        #   /api/reviews/*
│   │   │   ├── wishlistRoutes.js      #   /api/wishlist/*
│   │   │   ├── notificationRoutes.js  #   /api/notifications/*
│   │   │   ├── contactRoutes.js       #   /api/contact/*
│   │   │   ├── newsletterRoutes.js    #   /api/newsletter/*
│   │   │   └── masterDataRoutes.js    #   /api/master-data/*
│   │   │
│   │   ├── services/                  # Business logic services
│   │   │   ├── analyticsService.js    #   MongoDB aggregation pipelines
│   │   │   ├── authService.js         #   OTP generation & hashing
│   │   │   ├── emailService.js        #   Branded HTML email templates
│   │   │   ├── paymentService.js      #   Razorpay order & refund logic
│   │   │   └── uploadService.js       #   Cloudinary stream upload handler
│   │   │
│   │   ├── utils/                     # Shared utilities
│   │   │   ├── ApiError.js            #   Custom error class
│   │   │   ├── ApiResponse.js         #   Standardized response wrapper
│   │   │   ├── apiFeatures.js         #   Query filtering, sorting, pagination
│   │   │   ├── currency.js            #   Currency formatting helpers
│   │   │   └── generateId.js          #   Unique ID generation
│   │   │
│   │   ├── validations/               # Joi validation schemas
│   │   │   ├── authValidation.js      #   Auth input schemas
│   │   │   ├── userValidation.js      #   Profile update schemas
│   │   │   ├── vehicleValidation.js   #   Vehicle create/update schemas
│   │   │   ├── bookingValidation.js   #   Booking & cancellation schemas
│   │   │   └── paymentValidation.js   #   Payment order & verify schemas
│   │   │
│   │   └── scripts/                   # Database seed & migration scripts
│   │       ├── seed.js                #   Vehicle data seeder
│   │       ├── addVehicleSpecs.js     #   Spec field migration
│   │       ├── fixVehicleSlugs.js     #   Slug normalization
│   │       └── updateVendor.js        #   Vendor data updates
│   │
│   ├── render.yaml                    # Render deployment configuration
│   └── package.json
│
└── frontend/
    ├── index.html                     # Entry HTML with SEO meta tags
    ├── vercel.json                    # Vercel deployment & SPA rewrites
    ├── vite.config.js                 # Vite build configuration
    ├── eslint.config.js               # ESLint flat config
    │
    ├── public/                        # Static assets (favicon, images)
    │
    └── src/
        ├── App.jsx                    # Root application component
        ├── main.jsx                   # React DOM entry point
        │
        ├── app/                       # Redux store configuration
        │
        ├── components/                # Reusable UI components
        │   ├── auth/                  #   OTP modal, OAuth button, auth forms
        │   ├── common/                #   Navbar, Footer, Modals, Loading states
        │   └── ui/                    #   Design system primitives (buttons, inputs)
        │
        ├── hooks/                     # Custom React hooks
        │   └── useWishlist.js         #   Wishlist state management hook
        │
        ├── layouts/                   # Page layout wrappers
        │   ├── MainLayout.jsx         #   Public pages (navbar + footer)
        │   ├── DashboardLayout.jsx    #   User dashboard with sidebar
        │   ├── VendorDashboardLayout.jsx  # Vendor dashboard with sidebar
        │   └── AdminDashboardLayout.jsx   # Admin dashboard with sidebar
        │
        ├── pages/                     # Page-level components
        │   ├── public/                #   HomePage, Login, Register, About, Contact,
        │   │   │                      #   Collections, Experience, Legal pages,
        │   │   │                      #   Vendor Signup, OAuth Callback,
        │   │   │                      #   Forgot/Reset Password
        │   │   └── components/        #   Public page sub-components
        │   │
        │   ├── vehicles/             #   VehicleList, VehicleDetails, BookingSuccess
        │   │   ├── components/        #   Vehicle page sub-components
        │   │   ├── sections/          #   Vehicle page section components
        │   │   └── data/              #   Static vehicle data
        │   │
        │   ├── user/                  #   Dashboard, Bookings, Payments, Invoices,
        │   │                          #   Profile, Reviews, Wishlist, Notifications,
        │   │                          #   Messages, Support
        │   │
        │   ├── vendor/                #   Overview, AddVehicle, EditVehicle,
        │   │                          #   ManageFleet, Bookings, Availability,
        │   │                          #   Revenue, Analytics, Support
        │   │
        │   └── admin/                 #   Overview, UserMgmt, VendorMgmt,
        │                              #   FleetApprovals, Bookings, Collections,
        │                              #   Concierge, Analytics, Calendar, Login
        │
        ├── providers/                 # Context providers
        │
        ├── redux/                     # Redux state management
        │   └── slices/
        │       ├── authSlice.js       #   Authentication state & async thunks
        │       ├── vehicleSlice.js    #   Vehicle listing state
        │       ├── bookingSlice.js    #   Booking management state
        │       ├── vendorSlice.js     #   Vendor operations state
        │       ├── adminSlice.js      #   Admin operations state
        │       ├── dashboardSlice.js  #   Dashboard analytics state
        │       ├── reviewSlice.js     #   Reviews state
        │       ├── notificationSlice.js # Notification state
        │       └── uiSlice.js         #   UI toggle state
        │
        ├── routes/                    # Client-side routing
        │   ├── AppRoutes.jsx          #   Route definitions & lazy loading
        │   ├── ProtectedRoute.jsx     #   Auth-required route guard
        │   ├── RoleRoute.jsx          #   Role-based route guard
        │   └── GuestRoute.jsx         #   Redirect-if-logged-in guard
        │
        ├── sections/                  # Modular page sections (46 components)
        │   ├── HeroSection.jsx        #   Animated homepage hero
        │   ├── FeaturedVehicles.jsx   #   Featured car carousel
        │   ├── About*.jsx             #   About page sections
        │   ├── Contact*.jsx           #   Contact page sections
        │   ├── Experience*.jsx        #   Experience page sections
        │   ├── Collection*.jsx        #   Collection page sections
        │   └── ...                    #   CTA, FAQ, Stats, Testimonials, etc.
        │
        ├── services/                  # API layer
        │   └── api.js                 #   Axios instance with interceptors
        │
        ├── styles/                    # Global stylesheets
        │
        ├── lib/                       # Utility libraries
        │
        └── utils/                     # Helper functions
```

---

## 🚀 Quick Start Guide

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| Node.js | v18.0.0+ |
| npm | v9.0.0+ |
| MongoDB Atlas | Active cluster (or local MongoDB) |
| Razorpay Account | Test Key ID & Secret |
| Cloudinary Account | Cloud name, API key & secret |
| Google Cloud Console | OAuth 2.0 Client ID & Secret |
| Gmail App Password | For SMTP email delivery |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Aaryan-9784/Luxoria.git
cd Luxoria
```

### Step 2 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### Step 3 — Configure Environment Variables

```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit both `.env` files with your credentials — see [Environment Variables](#-environment-variables) below.

### Step 4 — Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
```
> 🚀 **Backend API:** `http://localhost:5000`

```bash
# Terminal 2 — Frontend
cd frontend
npm run dev
```
> 🌐 **Frontend App:** `http://localhost:5173`

### Step 5 — Seed Database *(Optional)*

```bash
# From the backend directory
node src/scripts/seed.js
```

---

## 🔑 Environment Variables

### `backend/.env`

```env
# ── Application ──────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ── MongoDB ──────────────────────────────────────
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxoria?retryWrites=true&w=majority

# ── JWT Tokens ───────────────────────────────────
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Google OAuth 2.0 ────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ── Razorpay ─────────────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ── Cloudinary ───────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── SMTP Email (Nodemailer) ─────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM=noreply@luxoria.com

# ── Admin ────────────────────────────────────────
ADMIN_EMAIL=admin@luxoria.com
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 🔐 Security & Authentication

### 2-Step OTP Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Login   │────▶│  Verify      │────▶│  Generate    │────▶│  Email OTP   │
│  Form    │     │  Password    │     │  6-Digit OTP │     │  to User     │
│          │     │  (bcrypt)    │     │  (SHA-256)   │     │  (Nodemailer)│
└──────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                   │
┌──────────┐     ┌──────────────┐     ┌──────────────┐            │
│  Access  │◀────│  Issue JWT   │◀────│  Verify OTP  │◀───────────┘
│  Granted │     │  Tokens      │     │  Input       │
└──────────┘     └──────────────┘     └──────────────┘
```

1. User submits email & password on the login form
2. Server verifies password hash via **bcrypt**
3. Server generates a random 6-digit OTP, computes **SHA-256 hash**, saves it in MongoDB with **10-minute expiration**
4. Server emails the plain 6-digit OTP code via **Nodemailer** using a branded HTML template
5. User inputs the OTP code on the verification modal
6. Server verifies OTP hash, issues **JWT access token** (in memory) and sets **HTTP-only refresh cookie**

### Security Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| `helmet` | Sets secure HTTP headers |
| `hpp` | Protects against HTTP parameter pollution |
| `express-rate-limit` | Configurable rate limiting (auth, uploads, general) |
| `express-mongo-sanitize` | Prevents NoSQL injection attacks |
| `cors` | Configurable cross-origin resource sharing |
| `cookie-parser` | Parses HTTP-only refresh token cookies |

---

## 💳 Payment & Refund Architecture

```
 Client                    Backend                     Razorpay
   │                         │                            │
   │  1. Select Dates        │                            │
   │  ────────────────▶      │                            │
   │                         │  2. Create Order            │
   │                         │  ─────────────────────────▶│
   │                         │       Order ID              │
   │                         │  ◀─────────────────────────│
   │  3. Razorpay Modal      │                            │
   │  ◀──────────────────    │                            │
   │                         │                            │
   │  4. Payment Complete    │                            │
   │  ────────────────▶      │                            │
   │                         │  5. Verify HMAC-SHA256      │
   │                         │     Signature               │
   │                         │                            │
   │  6. Booking Confirmed   │                            │
   │  ◀──────────────────    │                            │
   │                         │  7. Email Receipt           │
   │                         │  ─────────────────────────▶│
   └─────────────────────────┴────────────────────────────┘
```

### Cancellation Refund Policy

| Timeframe | Refund | Description |
|-----------|--------|-------------|
| **> 48 hours** before start | 💯 100% | Full refund via Razorpay |
| **24 – 48 hours** before start | 🔸 50% | Partial refund via Razorpay |
| **< 24 hours** before start | ❌ 0% | No refund applicable |

---

## 📡 API Endpoint Reference

> **Base URL:** `http://localhost:5000/api`

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new client account |
| `POST` | `/login` | Public | Submit credentials & trigger 2FA OTP |
| `POST` | `/vendor/login` | Public | Vendor-specific login with OTP |
| `POST` | `/admin/login` | Public | Admin-specific login with OTP |
| `POST` | `/verify-otp` | Public | Verify 6-digit login OTP code |
| `POST` | `/resend-otp` | Public | Resend expired OTP code |
| `POST` | `/refresh` | Public | Rotate refresh token for new access token |
| `POST` | `/forgot-password` | Public | Initiate password reset via email |
| `PUT` | `/reset-password/:token` | Public | Reset password with valid token |
| `POST` | `/logout` | Public | Clear HTTP-only session cookies |
| `GET` | `/me` | Protected | Fetch authenticated user profile |
| `GET` | `/google` | Public | Initiate Google OAuth 2.0 flow |
| `GET` | `/google/callback` | Public | Google OAuth callback handler |

### 👤 Users — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/me` | Protected | Get current user profile |
| `PUT` | `/me` | Protected | Update profile information |
| `PUT` | `/me/avatar` | Protected | Upload avatar image (file) |
| `PUT` | `/me/avatar-url` | Protected | Update avatar via URL |
| `DELETE` | `/me/avatar` | Protected | Remove avatar |
| `PUT` | `/me/password` | Protected | Change password |

### 🚗 Vehicles — `/api/vehicles`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | Search & filter luxury vehicles |
| `GET` | `/featured` | Public | Get featured vehicle listings |
| `GET` | `/vendor` | Vendor | Get vendor's own vehicles |
| `GET` | `/:id` | Public | Get vehicle details by ID |
| `POST` | `/` | Vendor | Submit new vehicle for approval |
| `PUT` | `/:id` | Vendor | Update vehicle details |
| `DELETE` | `/:id` | Vendor | Remove vehicle listing |
| `POST` | `/:id/images` | Vendor | Upload vehicle images (rate limited) |
| `DELETE` | `/:id/images/:imageId` | Vendor | Delete specific vehicle image |

### 📅 Bookings — `/api/bookings`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Protected | List all bookings (user scoped) |
| `POST` | `/` | User | Create booking reservation |
| `GET` | `/my` | User | List user's own booking history |
| `GET` | `/vendor` | Vendor | List bookings for vendor's fleet |
| `GET` | `/:id` | Protected | Get booking details by ID |
| `PUT` | `/:id/status` | Vendor / Admin | Update booking status |
| `PUT` | `/:id/cancel` | User | Cancel a booking (triggers refund) |

### 💳 Payments — `/api/payments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/create-order` | User | Create Razorpay order with price calculation |
| `POST` | `/verify` | User | Verify HMAC-SHA256 payment signature |
| `GET` | `/:bookingId` | Protected | Get payment details for a booking |

### ⭐ Reviews — `/api/reviews`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/my` | User | Get user's own reviews |
| `GET` | `/:vehicleId` | Public | Get all reviews for a vehicle |
| `POST` | `/:vehicleId` | User | Submit a new review |
| `PUT` | `/:id` | User | Edit own review |
| `DELETE` | `/:id` | Protected | Delete a review |

### ❤️ Wishlist — `/api/wishlist`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Protected | Get user's wishlist |
| `POST` | `/:vehicleId` | Protected | Add vehicle to wishlist |
| `DELETE` | `/:vehicleId` | Protected | Remove vehicle from wishlist |

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/stream` | Protected | SSE notification stream (real-time) |
| `GET` | `/` | Protected | Get all notifications |
| `PUT` | `/read-all` | Protected | Mark all as read |
| `PUT` | `/:id/read` | Protected | Mark single notification as read |
| `DELETE` | `/` | Protected | Delete all notifications |
| `DELETE` | `/:id` | Protected | Delete single notification |

### 📬 Contact — `/api/contact`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Public | Submit general inquiry |
| `POST` | `/vendor` | Public | Submit vendor contact request |
| `POST` | `/support-ticket` | Protected | Submit support ticket (email to admin) |

### 📰 Newsletter — `/api/newsletter`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/subscribe` | Public | Subscribe to email newsletter |

### 🛡️ Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | Admin | List all platform users |
| `PUT` | `/users/:id/status` | Admin | Update user account status |
| `GET` | `/vendors` | Admin | List all vendors |
| `PUT` | `/vendors/:id/approve` | Admin | Approve/reject vendor application |
| `GET` | `/vehicles` | Admin | List all vehicles platform-wide |
| `PUT` | `/vehicles/:id/approve` | Admin | Approve/reject vehicle listing |
| `DELETE` | `/vehicles/:id` | Admin | Remove vehicle from platform |
| `GET` | `/bookings` | Admin | List all bookings platform-wide |
| `GET` | `/analytics` | Admin | Get platform analytics aggregations |
| `GET` | `/concierge` | Admin | List all concierge requests |
| `PUT` | `/concierge/:id/status` | Admin | Update concierge request status |

### 📊 Master Data — `/api/master-data`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/:category` | Public | Get lookup data by category |
| `POST` | `/` | Admin | Create new master data entry |
| `PUT` | `/:id` | Admin | Update master data entry |
| `DELETE` | `/:id` | Admin | Delete master data entry |

---

## 🚢 Deployment Guide

### Frontend → Vercel

1. **Connect** your GitHub repository to [Vercel](https://vercel.com)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Framework Preset:** Vite
6. **Environment Variables:**
   - `VITE_API_URL` → Your deployed backend URL (e.g., `https://luxoria-api.onrender.com/api`)
   - `VITE_RAZORPAY_KEY_ID` → Your Razorpay live/test key ID

> **Note:** The `vercel.json` file already includes SPA rewrite rules for client-side routing.

### Backend → Render

1. **Connect** your GitHub repository to [Render](https://render.com)
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start` (runs `node src/server.js`)
5. **Add all environment variables** from `backend/.env`

> **Note:** The `render.yaml` blueprint is included for one-click Render deployment.

### Post-Deployment Checklist

- [ ] Update `CLIENT_URL` in backend `.env` to your Vercel deployment URL
- [ ] Update `GOOGLE_CALLBACK_URL` to use your Render backend URL
- [ ] Update `VITE_API_URL` in frontend `.env` to your Render backend URL
- [ ] Add your Vercel domain to the CORS whitelist in `app.js`
- [ ] Switch Razorpay keys from test to live mode for production
- [ ] Verify MongoDB Atlas network access includes Render's IP ranges

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Aaryan-9784/Luxoria/issues).

### Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### License

Distributed under the **MIT License**.

---

<div align="center">

### 👨‍💻 Developer

**Aryan Patel** — Full-Stack Developer & Creator

[![GitHub](https://img.shields.io/badge/GitHub-Aaryan--9784-181717?logo=github&logoColor=white&style=for-the-badge)](https://github.com/Aaryan-9784)
[![Email](https://img.shields.io/badge/Email-aaryanpatel9784-EA4335?logo=gmail&logoColor=white&style=for-the-badge)](mailto:aaryanpatel9784@gmail.com)

---

© 2026 **LUXORIA Premium Private Limited**. All Rights Reserved.

**Contact:** [aaryanpatel9784@gmail.com](mailto:aaryanpatel9784@gmail.com) · +91 82380 12515

Built with ❤️ using the MERN Stack

</div>

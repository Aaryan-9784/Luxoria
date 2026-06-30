# LUXORIA — Ultra-Premium Luxury Car Rental Platform

<div align="center">

  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
  [![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://mongodb.com)
  [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org)
  [![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=white&style=for-the-badge)](https://razorpay.com)

  <p><b>A production-ready MERN stack platform connecting elite clientele with premium automotive partners. Features three role-based portals, Razorpay payments, Google OAuth, and enterprise-grade analytics.</b></p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Feature Highlights](#feature-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Payment Flow](#payment-flow)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Architecture Highlights](#architecture-highlights)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

LUXORIA is a full-stack luxury car rental SaaS with three distinct portals built on a single codebase:

| Portal | Audience | Key Capability |
|---|---|---|
| **User Portal** | Customers | Browse, wishlist, book, and pay for luxury vehicles |
| **Vendor Dashboard** | Fleet owners | Manage vehicles, track bookings and revenue, view analytics |
| **Admin Panel** | Platform operators | Approve vendors/vehicles, manage users, monitor platform analytics |

---

## Feature Highlights

**Authentication & Security**
- JWT dual-token system: 15-min access token + 7-day refresh token with automatic rotation
- Refresh token reuse detection — compromised sessions are invalidated platform-wide
- Google OAuth 2.0 via Passport.js with account linking
- Separate login portals for users, vendors, and admins
- Rate limiting (3 tiers), Helmet, HPP, and NoSQL injection prevention

**Booking Engine**
- Real-time date overlap validation to prevent double bookings
- Server-side pricing: `totalDays × pricePerDay`
- Booking lifecycle: `pending → confirmed → active → completed → cancelled`
- Vendor and user notifications at every status change

**Payments (Razorpay)**
- Three-step flow: create order → frontend checkout → HMAC-SHA256 signature verification
- Refund support via `initiateRefund()` helper
- Payment records linked to bookings with full audit trail

**Media Management**
- Cloudinary v2 with stream-based uploads (no temp files via `streamifier`)
- Multi-image support for vehicles and reviews

**Analytics**
- Admin: 11 parallel MongoDB aggregations (revenue, bookings by status, monthly trends, top vendors, fleet distribution)
- Vendor: 5 parallel aggregations scoped to their fleet

**Additional Modules**
- Wishlists, Reviews (with auto-recalculated vehicle ratings), Notifications (90-day TTL), Concierge requests, Newsletter, Contact form, Master data CMS

---

## Tech Stack

### Backend
| Concern | Library / Version |
|---|---|
| Framework | Express 4 (ESM modules) |
| Database | MongoDB + Mongoose 8 |
| Auth | jsonwebtoken 9, bcryptjs 2, passport-google-oauth20 2 |
| Payments | razorpay 2.9 |
| File Storage | cloudinary 2, multer 1, streamifier |
| Email | nodemailer 6 |
| Validation | joi 17 |
| Security | helmet 7, hpp, express-mongo-sanitize, express-rate-limit 7 |
| Logging | morgan |
| Deployment | Render (render.yaml) |

### Frontend
| Concern | Library / Version |
|---|---|
| Framework | React 19 + Vite 6 |
| State | Redux Toolkit 2 + React-Redux 9 |
| Routing | React Router DOM 7 |
| Forms | React Hook Form 7 |
| HTTP | Axios 1.7 (custom interceptors) |
| UI System | shadcn/ui (New York) + Tailwind CSS 4 |
| Icons | Lucide React |
| Animation | Framer Motion 11 |
| Charts | Recharts 3 |
| Payments | Razorpay checkout.js (CDN) |

---

## Project Structure

```
LUXORIA/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js       # Cloudinary SDK setup
│   │   │   ├── db.js               # Mongoose connect (pool size 10)
│   │   │   ├── mail.js             # Nodemailer transporter
│   │   │   ├── passport.js         # Google OAuth strategy
│   │   │   └── razorpay.js         # Razorpay SDK instance
│   │   ├── constants/
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── contactController.js
│   │   │   ├── masterDataController.js
│   │   │   ├── newsletterController.js
│   │   │   ├── notificationController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   ├── userController.js
│   │   │   ├── vehicleController.js
│   │   │   └── wishlistController.js
│   │   ├── middleware/
│   │   │   ├── asyncHandler.js     # Async error wrapper
│   │   │   ├── auth.js             # protect, optionalAuth, authorize
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   ├── rateLimiter.js      # general / auth / upload tiers
│   │   │   ├── upload.js           # Multer (memory storage)
│   │   │   └── validate.js         # Joi schema middleware
│   │   ├── models/
│   │   │   ├── Booking.js
│   │   │   ├── ConciergeRequest.js
│   │   │   ├── MasterData.js
│   │   │   ├── Newsletter.js
│   │   │   ├── Notification.js     # TTL index (90 days)
│   │   │   ├── Payment.js
│   │   │   ├── Review.js
│   │   │   ├── User.js
│   │   │   ├── Vehicle.js          # 2dsphere + text indexes
│   │   │   └── Wishlist.js
│   │   ├── routes/                 # 12 route modules
│   │   ├── scripts/
│   │   │   ├── seed.js
│   │   │   └── updateVendor.js
│   │   ├── services/
│   │   │   ├── analyticsService.js # Parallel aggregation pipelines
│   │   │   ├── authService.js      # JWT helpers, cookie utils
│   │   │   ├── emailService.js     # Transactional email templates
│   │   │   ├── paymentService.js   # Razorpay order/verify/refund
│   │   │   └── uploadService.js    # Cloudinary stream upload
│   │   ├── utils/
│   │   │   ├── ApiError.js         # Custom error class with static factories
│   │   │   ├── ApiFeatures.js      # Chainable Mongoose query builder
│   │   │   ├── ApiResponse.js      # Consistent response formatters
│   │   │   └── generateId.js       # LUX-XXXXXXXX booking ID generator
│   │   ├── validations/            # Joi schemas (auth, booking, payment, vehicle)
│   │   ├── app.js                  # Express app factory
│   │   └── server.js               # HTTP server + DB connect + graceful shutdown
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/             # Navbar, Footer, Sidebar, ScrollToTop
    │   │   ├── sections/           # 40+ page sections
    │   │   └── ui/                 # Alert, Badge, Button, DataTable, Modal, etc.
    │   ├── layouts/
    │   │   ├── MainLayout.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   ├── VendorDashboardLayout.jsx
    │   │   └── AdminDashboardLayout.jsx
    │   ├── pages/
    │   │   ├── admin/              # AdminOverview, UserManagement, Analytics, etc.
    │   │   ├── public/             # HomePage, LoginPage, Collection, etc.
    │   │   ├── user/               # Dashboard, Bookings, Wishlist, Payments, etc.
    │   │   ├── vehicles/           # VehicleListPage, VehicleDetailsPage
    │   │   └── vendor/             # VendorOverview, ManageFleet, AddVehicleWizard, etc.
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── adminSlice.js
    │   │       ├── authSlice.js
    │   │       ├── bookingSlice.js
    │   │       ├── dashboardSlice.js
    │   │       ├── notificationSlice.js
    │   │       ├── uiSlice.js
    │   │       ├── vehicleSlice.js
    │   │       └── vendorSlice.js
    │   ├── routes/
    │   │   ├── AppRoutes.jsx       # All routes + session restore on mount
    │   │   ├── GuestRoute.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── RoleRoute.jsx
    │   ├── services/
    │   │   └── api.js              # Axios instance with refresh token interceptor
    │   ├── hooks/                  # Custom React hooks
    │   └── lib/                    # Utility helpers
    ├── public/
    ├── index.html                  # Razorpay checkout.js CDN loaded here
    ├── .env.example
    └── package.json
```

---

## Database Schema

### User
```
name, email (unique), password (bcrypt, hidden), phone
avatar: { url, publicId }
role: 'user' | 'vendor' | 'admin'
googleId (sparse unique)
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
location: { city, state, address, coordinates (2dsphere) }
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
isActive
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
| Wishlist | user + vehicle (unique compound) |
| Notification | recipient, type, title, message, isRead — TTL 90 days |
| ConciergeRequest | clientName, requestId, type, status, priority (low/medium/high) |
| MasterData | category (brand/city/feature/vehicleType/faq), label, value, icon |
| Newsletter | email (unique), subscribedAt, isActive |

---

## Authentication Flow

```
Register / Login
  ├── Returns accessToken (15 min) in response body
  └── Sets refreshToken (7 days) as httpOnly cookie
         └── Also persisted in User.refreshTokens[] in MongoDB

Authenticated Request
  └── Axios attaches Authorization: Bearer <accessToken>

Token Expiry (401)
  ├── Axios interceptor calls POST /api/auth/refresh
  ├── Backend does atomic token rotation via findOneAndUpdate
  │     └── If old token not found → reuse detected → all sessions wiped
  ├── Concurrent failed requests are queued and replayed on success
  └── On refresh failure → Redux logout dispatched

Session Restore (page load)
  └── AppRoutes calls POST /auth/refresh → GET /auth/me → sets Redux state

Google OAuth
  └── GET /api/auth/google → callback → redirect to /oauth-callback
        └── OAuthCallback component exchanges cookie for accessToken

Password Reset
  └── 32-byte crypto token, SHA-256 hashed in DB, 10-min expiry
        └── On reset → all sessions invalidated (refreshTokens cleared)
```

---

## Payment Flow

```
1. POST /api/payments/create-order
   └── Creates Razorpay order (amount × 100 paise, auto-capture)
       Creates Payment record with status "created"
       Returns { orderId, amount, currency, key }

2. Frontend opens Razorpay modal (checkout.js)
   └── User completes payment
       Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }

3. POST /api/payments/verify
   └── HMAC-SHA256: sha256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
       On valid signature:
         Payment.status → "captured"
         Booking.status → "confirmed"
         Sends booking confirmation email (non-blocking)
```

---

## API Reference

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
| POST | `/forgot-password` | Public | Send reset email |
| PUT | `/reset-password/:token` | Public | Reset password |
| GET | `/google` | Public | Google OAuth redirect |
| GET | `/google/callback` | Public | Google OAuth callback |

### Vehicles — `/api/vehicles`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List vehicles (filter, search, paginate) |
| GET | `/:id` | Public | Vehicle details |
| POST | `/` | Vendor | Create vehicle listing |
| PUT | `/:id` | Vendor | Update vehicle |
| DELETE | `/:id` | Vendor | Delete vehicle |
| POST | `/:id/images` | Vendor | Upload vehicle images |

### Bookings — `/api/bookings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Create booking |
| GET | `/my` | User | User's bookings |
| GET | `/vendor` | Vendor | Vendor's bookings |
| GET | `/:id` | Protected | Booking details |
| PUT | `/:id/status` | Vendor/Admin | Update booking status |
| PUT | `/:id/cancel` | User | Cancel booking |

### Payments — `/api/payments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-order` | User | Create Razorpay order |
| POST | `/verify` | User | Verify payment signature |
| GET | `/:bookingId` | Protected | Payment details |

### Admin — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id/status` | Admin | Activate/deactivate user |
| GET | `/vendors` | Admin | List all vendors |
| PUT | `/vendors/:id/approve` | Admin | Approve/reject vendor |
| GET | `/vehicles` | Admin | List all vehicles |
| PUT | `/vehicles/:id/approve` | Admin | Approve/reject vehicle |
| DELETE | `/vehicles/:id` | Admin | Delete vehicle |
| GET | `/bookings` | Admin | List all bookings |
| GET | `/analytics` | Admin | Dashboard analytics |
| GET | `/concierge` | Admin | Concierge requests |
| PUT | `/concierge/:id/status` | Admin | Update concierge status |

### Other Routes
| Prefix | Purpose |
|---|---|
| `/api/users` | Profile management, avatar upload, password change |
| `/api/wishlist` | Add/remove/list wishlist items |
| `/api/reviews` | Create/read/delete reviews |
| `/api/notifications` | List, mark read, clear notifications |
| `/api/master-data` | Reference data (brands, cities, features) |
| `/api/contact` | Contact form submission |
| `/api/newsletter` | Subscribe/unsubscribe |

---

## Environment Variables

### Backend — `backend/.env`
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/luxoria

# JWT
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

# Email (SMTP / Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@luxoria.com
```

### Frontend — `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account
- Razorpay account (test mode works)
- Google Cloud project with OAuth 2.0 credentials (optional)

### 1. Clone
```bash
git clone https://github.com/yourusername/luxoria.git
cd luxoria
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in all values in .env
npm run dev        # starts on port 5000
```

### 3. Frontend
```bash
# New terminal
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL and VITE_RAZORPAY_KEY_ID
npm run dev        # starts on port 5173
```

### 4. Seed Data (optional)
```bash
cd backend
node src/scripts/seed.js          # seed vehicles + master data
node seed_admin.js                 # create default admin account
node seedConcierge.js              # seed concierge requests
```

The app will be available at `http://localhost:5173`.

---

## Architecture Highlights

**Refresh Token Rotation with Reuse Detection**
Token rotation is atomic — `findOneAndUpdate` matches the specific token in `User.refreshTokens[]`. If a rotated token is replayed (attacker reuse scenario), the entire user's session array is wiped immediately.

**`injectStore()` Pattern**
The Axios instance reads the access token from Redux state. To avoid a circular dependency between `store.js` and `api.js`, the store is injected post-initialization via `injectStore()`.

**`ApiFeatures` Query Builder**
A chainable Mongoose query wrapper used across all list endpoints: `.search().filter().sort().selectFields().paginate()`. Keeps controllers thin and consistent.

**Parallel Analytics Aggregations**
All admin and vendor analytics run via `Promise.all()` with MongoDB aggregation pipelines — no N+1 queries, no client-side computation.

**Non-Blocking Emails**
All `emailService` calls use `.catch(() => {})` so SMTP failures never interrupt booking or payment flows.

**Global Error Handler**
One handler covers all error types: Mongoose `ValidationError`, `CastError`, duplicate key `11000`, JWT `JsonWebTokenError`/`TokenExpiredError`, and custom `ApiError` instances — all returning a consistent JSON shape.

**Notification TTL**
MongoDB's native TTL index on `Notification.createdAt` handles 90-day auto-deletion. No cron jobs, no manual cleanup.

**Geospatial Ready**
`2dsphere` index on `Vehicle.location.coordinates` is in place for nearest-vehicle and radius searches when that feature ships.

---

## Deployment

### Frontend — Vercel / Netlify
```bash
cd frontend
npm run build     # outputs to frontend/dist/
```
Set environment variables in your hosting dashboard. Both Vercel and Netlify handle SPA routing automatically with their default configs.

### Backend — Render
A `render.yaml` Blueprint is included for zero-config deployment:
```bash
# Render reads render.yaml on push — no manual setup needed
# Set all backend .env variables in Render's environment dashboard
```

For other providers (Railway, Fly.io, etc.):
```bash
cd backend
npm start         # production start command
```

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit with a clear message — `git commit -m 'feat: add your feature'`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please follow the existing code style (ESM imports, async/await, `ApiError`/`ApiResponse` patterns).

---

## License

Distributed under the MIT License.

---

<div align="center">
  <p>Built with the MERN stack &nbsp;·&nbsp; Deployed on Render &nbsp;·&nbsp; © 2026 LUXORIA</p>
</div>

# LUXORIA — Premium Luxury Vehicle Booking Platform

![Luxoria Banner](https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200&h=400)

LUXORIA is an enterprise-grade luxury vehicle booking ecosystem. Engineered with a premium white glassmorphism aesthetic inspired by Apple, Tesla, and Stripe, the platform seamlessly connects elite clientele with premium automotive partners.

## 🚀 Ecosystem Overview

The platform is divided into three comprehensive interfaces:

1. **User Portal**: A cinematic booking experience featuring advanced discovery, wishlist curation, and integrated Razorpay checkouts.
2. **Vendor Dashboard**: A robust SaaS platform for automotive partners to manage their luxury fleets, track revenue, and process incoming bookings.
3. **Enterprise Admin Panel**: A high-level system for platform administrators to monitor global analytics, approve vendor KYC, and verify vehicles before they hit the marketplace.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom CSS Variables (Glassmorphism theme)
- **State Management**: Redux Toolkit (Modular Slices)
- **Routing**: React Router DOM v7 (Nested Layouts, Protected Routes)
- **Animations**: Framer Motion
- **Components**: Radix/Shadcn-inspired UI + Lucide React Icons

### Backend
- **Environment**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: JWT + Google OAuth (Passport.js)
- **File Uploads**: Cloudinary + Multer
- **Payments**: Razorpay Gateway
- **Email Service**: Nodemailer (SMTP)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account
- Cloudinary account
- Razorpay account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/luxoria.git
cd luxoria
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in your keys:
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_*` credentials
- `RAZORPAY_*` credentials
- `SMTP_*` credentials

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env`:
- Set `VITE_API_URL=http://localhost:5000/api`
- Set `VITE_RAZORPAY_KEY_ID`

Start the Vite development server:
```bash
npm run dev
```

## 📐 Architecture Highlights

- **Role-Based Access Control**: Strict JWT middleware enforcing User, Vendor, and Admin isolation.
- **Optimized Uploads**: Multi-step forms separate database creation from image uploading to ensure data integrity during Cloudinary transfers.
- **Dynamic Aggregation**: Enterprise analytics are computed directly in MongoDB aggregation pipelines to reduce server memory overhead.
- **Security Protocols**: Backend secured via `helmet`, `express-mongo-sanitize`, `hpp`, and custom rate limiters.

## 🚢 Deployment

- **Frontend (Vercel)**: Configured with `vercel.json` to handle React SPA routing fallbacks natively.
- **Backend (Render/Railway)**: Configured with a `render.yaml` Blueprint for zero-downtime Infrastructure-as-Code deployment.

---

*Designed and engineered to represent the absolute pinnacle of luxury SaaS applications.*

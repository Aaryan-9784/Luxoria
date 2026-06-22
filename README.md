# LUXORIA — Premium Luxury Vehicle Booking Ecosystem

<div align="center">
  <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200&h=400" alt="Luxoria Banner" />
  <br />
  <br />

  [![React](https://img.shields.io/badge/React-19-blue?logo=react&style=for-the-badge)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&style=for-the-badge)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&style=for-the-badge)](https://nodejs.org)
  [![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&style=for-the-badge)](https://expressjs.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&style=for-the-badge)](https://mongodb.com)
  [![Redux Toolkit](https://img.shields.io/badge/Redux-593D88?logo=redux&style=for-the-badge)](https://redux.js.org/)

  <p align="center">
    <b>Engineered with a premium white glassmorphism aesthetic inspired by Apple, Tesla, and Stripe, LUXORIA seamlessly connects elite clientele with premium automotive partners.</b>
  </p>
</div>

---

## 📑 Table of Contents
- [Ecosystem Overview](#-ecosystem-overview)
- [Key Features](#-key-features)
- [Dashboards \& Portals](#-dashboards--portals)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation \& Local Setup](#️-installation--local-setup)
- [Architecture Highlights](#-architecture-highlights)
- [Deployment Strategy](#-deployment-strategy)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Ecosystem Overview

The platform is divided into three comprehensive interfaces designed to handle the entire luxury rental lifecycle:

1. 💎 **User Portal**: A cinematic booking experience featuring advanced discovery, wishlist curation, immersive vehicle showcases, and integrated Razorpay checkouts.
2. 🏎️ **Vendor Dashboard**: A robust SaaS platform for automotive partners to manage their luxury fleets, track revenue, and process incoming bookings with real-time analytics.
3. 🛡️ **Enterprise Admin Panel**: A high-level system for platform administrators to monitor global analytics, approve vendor KYC, verify vehicles before they hit the marketplace, and manage users.

## ✨ Key Features

- **Cinematic UI/UX**: State-of-the-art glassmorphism design, fluid framer-motion animations, and highly responsive layouts.
- **Secure Authentication**: Role-based JWT authentication combined with Google OAuth for frictionless onboarding.
- **Real-Time Booking**: Advanced date-picker system preventing overlapping bookings for the same vehicle.
- **Payment Gateway**: End-to-end Razorpay integration for secure and reliable transaction processing.
- **Cloud Media**: High-performance image storage and delivery via Cloudinary.
- **Interactive Dashboards**: Data-rich vendor and admin panels powered by MongoDB aggregation pipelines.

---

## 📊 Dashboards & Portals

LUXORIA provides tailor-made dashboards specific to the logged-in user role:

### 1. User Dashboard
Designed for clients to manage their luxury experience:
- **Dashboard Overview:** Quick glance at recent activities.
- **My Bookings:** History and active bookings.
- **Payments:** Payment history and statuses.
- **Profile & Wishlist:** Manage personal details and saved luxury vehicles.
- **Notifications:** Real-time alerts and booking updates.

### 2. Vendor Dashboard
Empowering fleet owners with complete control:
- **Vendor Overview:** Key metrics and performance indicators.
- **Manage Fleet:** Add, update, and remove vehicles.
- **Vendor Bookings:** View and manage incoming client reservations.
- **Revenue Tracker:** Detailed insights into earnings and payouts.

### 3. Admin Dashboard
Administrative command center for platform governance:
- **Admin Overview:** Platform-wide analytics and health.
- **User & Vendor Management:** Full control over accounts.
- **Vehicle Approvals:** Quality control and listing approvals.
- **Global Bookings:** Platform-wide transaction oversight.

---

## 💻 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom CSS Variables (Glassmorphism theme)
- **State Management**: Redux Toolkit (Modular Slices)
- **Routing**: React Router DOM v7 (Nested Layouts, Protected Routes, Role-based Routing)
- **Animations**: Framer Motion
- **Components**: Custom UI components inspired by Radix/Shadcn + Lucide React Icons

### Backend (Server)
- **Environment**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: JWT + Google OAuth (Passport.js)
- **File Uploads**: Cloudinary + Multer
- **Payments**: Razorpay Gateway
- **Email Service**: Nodemailer (SMTP)

---

## 📁 Project Structure

```text
luxoria/
├── backend/                  # Express.js Server
│   ├── src/
│   │   ├── controllers/      # Route handlers (Auth, Cars, Bookings)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   ├── middleware/       # JWT, Role checks, Error handling
│   │   └── utils/            # Helpers (Cloudinary, Email, Razorpay)
│   ├── uploads/              # Local temp storage for uploads
│   └── .env.example          # Backend environment template
│
└── frontend/                 # React + Vite Client
    ├── src/
    │   ├── components/       # Reusable UI elements (Shadcn inspired)
    │   ├── pages/            # Application views (Home, Dashboard)
    │   ├── redux/            # Redux store and slices
    │   ├── hooks/            # Custom React hooks
    │   └── assets/           # Static files and global CSS
    ├── public/               # Publicly accessible assets
    └── vite.config.js        # Vite configuration
```

---

## 🛠️ Installation & Local Setup

### Prerequisites
Ensure you have the following installed and set up on your machine:
- **Node.js** (v18+ recommended)
- **MongoDB Atlas** account (or local MongoDB server)
- **Cloudinary** account for image hosting
- **Razorpay** account for payment processing

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/luxoria.git
cd luxoria
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
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
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env`:
- Set `VITE_API_URL=http://localhost:5000/api`
- Set `VITE_RAZORPAY_KEY_ID=your_razorpay_key`

Start the Vite development server:
```bash
npm run dev
```

---

## 📐 Architecture Highlights

- **Role-Based Access Control**: Strict JWT middleware enforcing User, Vendor, and Admin isolation at both the routing level and API endpoint level.
- **Optimized Uploads**: Multi-step forms separate database creation from image uploading to ensure data integrity during Cloudinary transfers.
- **Dynamic Aggregation**: Enterprise analytics are computed directly in MongoDB aggregation pipelines to reduce server memory overhead and improve response times.
- **Security Protocols**: Backend secured via `helmet`, `express-mongo-sanitize`, `hpp`, and custom rate limiters to prevent DDoS and NoSQL injection attacks.

---

## 🚢 Deployment Strategy

- **Frontend**: Designed to be deployed on **Vercel** or **Netlify**. It includes a `vercel.json` configured to handle React SPA routing fallbacks natively.
- **Backend**: Ready for **Render**, **Railway**, or **Heroku**. Includes a `render.yaml` Blueprint for zero-downtime Infrastructure-as-Code deployment.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>Designed and engineered to represent the absolute pinnacle of luxury SaaS applications.</i>
  <br/>
  <br/>
  <p>Created by Luxoria Team &copy; 2026</p>
</div>

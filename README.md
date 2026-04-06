<div align="center">

# 🏙️ UrbanVista Services

**A full-stack digital visibility platform for local businesses — service ordering, client portal, admin dashboard, and transactional email, all in one.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](.)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Authentication & Security](#-authentication--security)
- [Database Schema](#-database-schema)
- [Email System](#-email-system)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 🌟 Overview

UrbanVista Services is a **full-stack digital agency platform** that combines a public marketing website with a complete client portal and admin back-office. Businesses can browse service packages, create accounts, place service orders, and track progress — all from one place.

The platform features immersive 3D visuals built with Three.js, a custom OTP-based email verification flow, in-memory API rate limiting, and a dual-database architecture using both **Firebase Firestore** (user & order data) and **Supabase PostgreSQL** (analytics, metrics, and avatar storage).

> ⚠️ **This project is actively under development.** Features and APIs are subject to change.

---

## ✨ Features

| Area | Feature | Description |
|---|---|---|
| 🌐 Public | **3D Hero Section** | Interactive WebGL scene built with Three.js + React Three Fiber |
| 🌐 Public | **Pricing Plans** | Three-tier service packages (Starter · Growth · Enterprise) with INR pricing |
| 🌐 Public | **Contact Form** | Validated contact form with admin email notification via Resend |
| 🌐 Public | **Blog** | Company news and updates |
| 🔐 Auth | **OTP Email Verification** | Custom 6-digit OTP flow with rate limiting (5 requests / 10 min) |
| 🔐 Auth | **Phone OTP Verification** | SMS OTP via Twilio for two-factor phone confirmation |
| 🔐 Auth | **Password Reset** | Secure OTP-gated password reset flow |
| 🔐 Auth | **Welcome Popup** | Animated first-login welcome experience with canvas confetti |
| 🎓 Client Portal | **Dashboard Overview** | Live stats: active orders, completed orders, verification status |
| 🎓 Client Portal | **My Orders** | Full order history with status tracking (Pending → In Progress → Completed) |
| 🎓 Client Portal | **Profile Management** | Edit name, phone, business type, date of birth, and avatar upload |
| 🎓 Client Portal | **Security Settings** | Password change and OTP-verified account controls |
| 🛠️ Admin | **Admin Dashboard** | Platform-wide stats: revenue, total users, orders, new queries |
| 🛠️ Admin | **User Management** | Browse, inspect, and manage all registered users |
| 🛠️ Admin | **Order Management** | View and update status on all service orders |
| 🛠️ Admin | **Query Inbox** | Manage inbound contact form submissions |
| 🔒 Security | **Route Blocking** | Middleware blocks `.env` files, common attack paths (`/wp-admin`, `/.git`, etc.) |
| 🔒 Security | **Rate Limiting** | In-memory per-route rate limiter (Upstash Redis-ready for production scale) |
| 🔒 Security | **RLS Policies** | Supabase Row Level Security enforced on all tables |

---

## 🛠️ Tech Stack

### Core

[![Next.js](https://img.shields.io/badge/Next.js-16.1_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

### 3D & Animation

[![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/@react--three/fiber-9-white?style=flat-square&logo=react)](https://docs.pmnd.rs/react-three-fiber)
[![React Three Drei](https://img.shields.io/badge/@react--three/drei-10-white?style=flat-square&logo=react)](https://github.com/pmndrs/drei)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=flat-square&logo=greensock&logoColor=black)](https://gsap.com/)

### Backend & Services

[![Firebase](https://img.shields.io/badge/Firebase_Auth-12.x-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Firestore](https://img.shields.io/badge/Firestore-NoSQL-FF6F00?style=flat-square&logo=firebase&logoColor=white)](https://firebase.google.com/products/firestore)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=flat-square)](https://resend.com/)
[![Twilio](https://img.shields.io/badge/Twilio-SMS_OTP-F22F46?style=flat-square&logo=twilio&logoColor=white)](https://www.twilio.com/)

### Charts & UI

[![Recharts](https://img.shields.io/badge/Recharts-3.x-8884d8?style=flat-square)](https://recharts.org/)
[![Lucide](https://img.shields.io/badge/Lucide_React-Icons-F97316?style=flat-square)](https://lucide.dev/)
[![bcryptjs](https://img.shields.io/badge/bcryptjs-Password_Hashing-6B7280?style=flat-square)](https://github.com/dcodeIO/bcrypt.js)

---

## 📁 Project Structure

```
urban-vista-services/
│
├── app/
│   ├── (dashboard)/              # Dashboard preview routes (demo / mock data)
│   │   └── dashboard-preview/
│   │       ├── overview/
│   │       ├── requests/
│   │       ├── profile/
│   │       └── security/
│   │
│   ├── dashboard/                # Live authenticated client portal
│   │   ├── page.tsx              # Client overview + order stats
│   │   ├── layout.tsx            # Auth guard + sidebar nav
│   │   ├── orders/               # Order history & tracking
│   │   ├── profile/              # Profile & avatar management
│   │   ├── security/             # Password & OTP settings
│   │   └── admin/                # Admin-only section
│   │       ├── page.tsx          # Admin stats (revenue, users, orders)
│   │       ├── users/            # User management
│   │       ├── orders/           # All orders management
│   │       └── queries/          # Contact form inbox
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/         # 6-digit OTP generation + email delivery
│   │   │   ├── verify-otp/       # OTP verification + email_verified flag
│   │   │   ├── send-phone-otp/   # Twilio SMS OTP
│   │   │   ├── verify-phone-otp/ # Phone OTP verification
│   │   │   ├── forgot-password/  # OTP-gated password reset request
│   │   │   ├── reset-password/   # New password submission
│   │   │   └── sync-user/        # Firebase ↔ Firestore user sync
│   │   ├── admin/
│   │   │   ├── stats/            # Platform-wide metrics
│   │   │   ├── users/[id]/       # User read / update / delete
│   │   │   ├── orders/[id]/      # Order status management
│   │   │   └── queries/[id]/     # Query status management
│   │   ├── user/
│   │   │   ├── stats/            # Per-user order stats
│   │   │   ├── orders/           # User's own orders
│   │   │   └── profile/          # Profile read / update
│   │   ├── orders/create/        # New service order submission
│   │   ├── contact/              # Contact form handler + email notification
│   │   └── cron/cleanup-otps/    # Scheduled OTP expiry cleanup
│   │
│   ├── auth/                     # Login / register page
│   ├── about/
│   ├── blog/
│   └── contact/
│
├── components/
│   ├── auth/                     # PullCharacter, WelcomePopup (confetti)
│   ├── hero/                     # Three.js StudioOrb + Hero scene
│   ├── sections/                 # Hero, HeroContent, Pricing, ValueProp
│   ├── shared/                   # Navbar, Footer, MotionSection
│   ├── contact/                  # ContactForm
│   └── ui/                       # Button, Input, GlassCard, Toast, Skeleton
│
├── lib/
│   ├── AuthContext.tsx            # Firebase auth state + Firestore user sync
│   ├── firebase-client.ts        # Firebase client SDK
│   ├── firebase-admin.ts         # Firebase Admin SDK
│   ├── firestore.ts              # Firestore data access layer
│   ├── rate-limit.ts             # In-memory rate limiter (Redis-ready)
│   ├── sanitize.ts               # Input sanitisation helpers
│   ├── twilio.ts                 # Twilio SMS client
│   └── emails/                   # React Email templates
│       ├── welcome-email.tsx
│       ├── otp-verification.tsx
│       ├── otp-password-reset.tsx
│       ├── order-confirmation.tsx
│       ├── contact-confirmation.tsx
│       └── admin-notification.tsx
│
├── middleware.ts                  # Route protection + attack path blocking
├── SUPABASE_SETUP.md             # SQL migration scripts
└── types/
```

---

## 🔐 Authentication & Security

The auth system combines **Firebase Auth** (identity) with **Firestore** (user profiles) and a custom OTP layer for verified email and phone confirmation.

```
User registers / logs in
        ↓
Firebase Auth issues ID token
        ↓
Client sets  urbanvista-token  cookie (SameSite=Lax, Secure, max-age 24h)
        ↓
Middleware validates cookie → protects /dashboard/*
        ↓
API routes verify Bearer token via Firebase Admin SDK
```

**OTP Verification Flow:**
```
POST /api/auth/send-otp   →  OTP hashed + stored in Firestore  →  email via Resend
POST /api/auth/verify-otp →  OTP verified  →  email_verified = true
                              Rate limited: 5 requests per 10 minutes per IP
```

**Security hardening in `middleware.ts`:**
- Blocks direct access to `.env`, `.pem`, `.key`, `.cert` files → `403 Forbidden`
- Returns `404` for attack scan paths: `/wp-admin`, `/.git`, `/phpmyadmin`, `/shell`, `/eval`, `/admin.php`, and more
- Rate limit headers applied at the API layer (`X-RateLimit-Policy: per-route`)

Valid roles: `USER` · `ADMIN`

---

## 🗄️ Database Schema

The project uses a **dual-database architecture**:

| Database | Used For |
|---|---|
| **Firebase Firestore** | Users, orders, OTPs, contact queries |
| **Supabase PostgreSQL** | Dashboard metrics, service requests, avatar storage (RLS-protected) |

**Key Supabase tables** (full SQL in `SUPABASE_SETUP.md`):

```
profiles              — user profile data (avatar_url, phone, dob, role, email_verified)
email_otps            — OTP store for unauthenticated email verification (server-only access)
dashboard_metrics     — single-row global stats (RLS: auth read · admin write only)
service_requests      — client requests (RLS: users see own rows · admins see all)
storage.avatars       — public avatar bucket (RLS: upload scoped to own UID folder)
```

---

## 📧 Email System

All transactional emails are built with **React Email** and delivered via **Resend**:

| Template | Trigger |
|---|---|
| `welcome-email` | New user registration |
| `otp-verification` | Email OTP send |
| `otp-password-reset` | Password reset request |
| `order-confirmation` | Service order placed |
| `contact-confirmation` | Contact form submission (to user) |
| `admin-notification` | Contact form submission (to admin) |

---

## 🚀 Getting Started

### Prerequisites

[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase_Project-Required-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://console.firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase_Project-Required-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Resend](https://img.shields.io/badge/Resend_API_Key-Required-000000?style=flat-square)](https://resend.com/)
[![Twilio](https://img.shields.io/badge/Twilio_Account-Required-F22F46?style=flat-square&logo=twilio&logoColor=white)](https://www.twilio.com/)

### Installation

```bash
git clone <your-repo-url>
cd urban-vista-services
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

Run the SQL migrations in `SUPABASE_SETUP.md` against your Supabase project SQL editor in order:

1. Enable Custom OTP Auth — adds `email_otps` table + `email_verified` column
2. Update Profiles Table — adds `avatar_url`, `phone`, `date_of_birth`
3. Create Dashboard Metrics Table
4. Create Service Requests Table
5. Setup Avatar Storage bucket + RLS policies

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Resend)
RESEND_API_KEY=

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never commit real credentials. Add `.env.local` to `.gitignore`.

---

## 🌐 Deployment

[![Vercel](https://img.shields.io/badge/Vercel-Recommended-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Supported-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
[![AWS](https://img.shields.io/badge/AWS_Amplify-Supported-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white)](https://aws.amazon.com/amplify/)

1. Push to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Run Supabase migrations (see `SUPABASE_SETUP.md`)
5. Deploy

> 💡 **Production note:** The rate limiter uses an in-memory store. For production scale, replace it with [Upstash Redis](https://upstash.com/) — the interface in `lib/rate-limit.ts` is drop-in compatible.

---

<div align="center">

**Built with ❤️ by Hritik Singh · Private / Proprietary · All rights reserved.**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/hritik-singh-4b85783b2/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/hritik2006singh-wq)

</div>

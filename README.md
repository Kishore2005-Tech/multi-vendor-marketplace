# AutoBoyExpress — Multi-Vendor E-Commerce Marketplace

A full-stack multi-vendor marketplace where independent sellers can open their own storefronts, list products, and manage orders — while buyers shop across all vendors from a single unified platform. Built with a decoupled Next.js frontend and a Node.js/Express REST API, with per-vendor order splitting, commission tracking, and admin moderation built in from the ground up.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Vendra solves a problem most e-commerce templates skip: **supporting many independent sellers under one roof.** Instead of a single-owner store, Vendra separates the platform into three roles — buyers, vendors, and admins — each with their own dashboard and permissions, and handles the messy parts of multi-vendor commerce that a single-seller store never has to deal with:

- One checkout can contain products from multiple vendors — the order is automatically split into per-vendor sub-orders for fulfillment.
- Every sale is tracked against a vendor's commission rate, feeding a payout ledger.
- New vendors and new product listings go through an admin approval step before going live.

## Features

**Buyer**
- Browse and search products across all vendors, with category/price filters
- Product detail pages with vendor storefront links
- Cart and multi-vendor checkout in a single flow
- Order history and wishlist

**Vendor**
- Vendor onboarding and storefront profile
- Product listing management (create, edit, stock tracking)
- Per-vendor order view and fulfillment status
- Payout ledger showing commission-adjusted earnings

**Admin**
- Vendor approval/rejection queue
- Product moderation queue
- Platform-wide analytics (GMV, active vendors, order volume)

**Platform**
- JWT-based authentication with role-based access control (buyer / vendor / admin)
- Razorpay payment integration
- Cloudinary-hosted product images
- Automatic order splitting and commission calculation at checkout

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Client state | Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT (bcrypt-hashed passwords) |
| Media storage | Cloudinary |
| Payments | Razorpay |
| Validation | Zod |

## Architecture

Vendra is a **decoupled monorepo**: the Next.js client and the Express API are independent services that communicate over REST, deployed separately (client on Vercel, server on Render/Railway). This keeps the frontend free to use Next.js's server components and routing without being coupled to backend infrastructure, and lets the API scale or be swapped independently.

```
Buyer/Vendor/Admin (browser)
        │
        ▼
Next.js Client (Vercel) ──── REST/JSON ────▶ Express API (Render/Railway)
                                                     │
                                        ┌────────────┼────────────┐
                                        ▼            ▼            ▼
                                   MongoDB Atlas  Cloudinary   Razorpay
```

## Project Structure

```
multi-vendor-marketplace/
├── client/                          # Next.js frontend
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                # Browse/search
│   │   │   │   └── [slug]/page.tsx         # Product detail
│   │   │   ├── vendors/
│   │   │   │   └── [vendorId]/page.tsx     # Vendor storefront
│   │   │   ├── cart/page.tsx
│   │   │   └── checkout/page.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx
│   │   │   └── sign-up/page.tsx
│   │   ├── dashboard/                      # Buyer dashboard
│   │   │   ├── orders/page.tsx
│   │   │   └── wishlist/page.tsx
│   │   ├── vendor/                         # Vendor dashboard
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── payouts/page.tsx
│   │   ├── admin/                          # Admin dashboard
│   │   │   ├── vendors/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                             # shadcn components
│   │   ├── product-card.tsx
│   │   ├── vendor-card.tsx
│   │   ├── cart-drawer.tsx
│   │   └── navbar.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── cart-store.ts
│   ├── types/
│   └── package.json
│
├── server/                          # Node.js/Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── cloudinary.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Vendor.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── OrderItem.ts
│   │   │   ├── Payout.ts
│   │   │   └── Review.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── vendor.middleware.ts
│   │   │   ├── admin.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── services/
│   │   │   ├── payment.service.ts
│   │   │   ├── payout.service.ts
│   │   │   └── notification.service.ts
│   │   ├── utils/
│   │   └── app.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- Cloudinary account
- Razorpay account (test mode keys are fine for development)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/multi-vendor-marketplace.git
cd multi-vendor-marketplace
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env.local   # then fill in your actual values
npm run dev
```
App runs at `http://localhost:3000`.

## Environment Variables

**server/.env**
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLIENT_URL=http://localhost:3000
PLATFORM_COMMISSION_PERCENT=10
```

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (buyer/vendor) |
| POST | `/api/auth/login` | Log in, receive JWT |
| GET | `/api/products` | List/search/filter products |
| GET | `/api/products/:slug` | Product detail |
| POST | `/api/vendor/products` | Create product (vendor only) |
| GET | `/api/vendor/orders` | Vendor's orders |
| POST | `/api/orders` | Create order (splits across vendors) |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| PATCH | `/api/admin/vendors/:id/approve` | Approve a vendor |
| PATCH | `/api/admin/products/:id/moderate` | Approve/reject a listing |

## Roadmap
- [ ] Vendor-to-buyer messaging
- [ ] Coupon/discount engine
- [ ] Automated payout scheduling
- [ ] Product reviews with photo uploads
- [ ] Multi-currency support

## License
MIT

# SecondLife Market — Second-hand Items Ordering Website

A full-stack MERN (MongoDB, Express, React, Node) web app for listing and
selling second-hand items, with cash-on-delivery checkout and a simple
admin dashboard to manage listings and orders.

## Project Structure

```
secondhand-marketplace/
├── backend/     # Express + MongoDB API
└── frontend/    # React (Vite) storefront + admin
```

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — get a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
  (create a free M0 cluster, add a database user, allow network access from
  anywhere, then copy the connection string)
- `JWT_SECRET` — any long random string (e.g. generate one at
  https://randomkeygen.com)

Run the backend:
```bash
npm run dev
```
It should start on http://localhost:5000

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
It should start on http://localhost:5173

## 3. Make Yourself an Admin

By default every new signup is a normal customer. To manage listings and
orders, make your account an admin directly in MongoDB Atlas:
1. Sign up normally on the site (creates your user).
2. In MongoDB Atlas, open your database → `users` collection.
3. Find your user document and change `isAdmin` from `false` to `true`.
4. Log out and log back in on the site — you'll now see an "Admin" link.

## 4. Add Your First Listings

Go to `/admin` while logged in as an admin. Fill in the "Add New Item" form
— title, description, price, category, condition, and one or more image
URLs (comma-separated; you can host photos for free on https://imgbb.com
or Cloudinary and paste the direct image link).

## 5. Deploying (Free Tier Options)

- **Backend**: Render.com (free web service) — connect your GitHub repo,
  set the root directory to `backend`, add your `.env` variables in the
  Render dashboard.
- **Frontend**: Vercel.com — connect your GitHub repo, set the root
  directory to `frontend`, add `VITE_API_URL` pointing to your deployed
  backend URL (e.g. `https://your-backend.onrender.com/api`).
- **Database**: MongoDB Atlas free tier (already set up in step 1).

## What's Included

- Product browsing with search and category filters
- Product detail pages
- Cart (persisted in browser) and checkout with shipping address
- Cash-on-delivery order flow (add Razorpay later for online payments)
- Customer login/signup with JWT authentication
- "My Orders" page for customers
- Admin dashboard: add/delete listings, view and update order status

## Suggested Next Steps

- Add Razorpay integration for online payments (UPI/cards)
- Add image upload (instead of pasting URLs) using Cloudinary or Multer
- Add email/WhatsApp order notifications
- Add product edit (not just add/delete) in the admin panel
- Add pagination once you have many listings

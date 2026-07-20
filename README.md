# SKYRA Jewels - Full Stack Jewelry E-Commerce Website

SKYRA Jewels is a full-stack jewelry e-commerce platform built for a real-world jewelry brand. The project includes a responsive customer storefront, secure authentication, product management, cart and wishlist features, Razorpay payment integration, order management, email notifications, and a custom admin dashboard.

🌐 **Live Website:** https://skyrajewels.co.in

---

## 📌 Project Overview

SKYRA Jewels is designed as a production-style e-commerce website for selling jewelry products online. The platform allows customers to browse products, view product details, add items to cart or wishlist, checkout securely, and track orders.

The admin panel allows store administrators to manage products, categories, orders, shipping settings, admin users, and website settings from a dedicated dashboard.

---

## 🖼️ Screenshots

### Home Page
<img width="1901" height="905" alt="image" src="https://github.com/user-attachments/assets/a8189fd4-1f10-4ef0-bfb2-59e13d886ec2" />
screenshot of home-page

### Product Page 
<img width="1895" height="925" alt="image" src="https://github.com/user-attachments/assets/31fd01c5-a063-42ce-92d5-681bc6e39514" />
screenshot of product-page

### Cart Page
<img width="1896" height="927" alt="image" src="https://github.com/user-attachments/assets/2125bd9e-0ee2-4b9a-91bb-d5738f2e76be" />
screenshot of cart-page

### Checkout Page
<img width="1891" height="927" alt="image" src="https://github.com/user-attachments/assets/4f282ce1-cc43-4f04-bb0f-ae17001f2b8b" />
screenshot of checkout-page

### Dashboard Page
<img width="1892" height="922" alt="image" src="https://github.com/user-attachments/assets/ffafc51e-2cad-4ef7-aacc-7858fb846316" />
screenshots/admin-dashboard.png

### Admin Product Page
<img width="1882" height="917" alt="image" src="https://github.com/user-attachments/assets/60b6bdf2-e629-4a42-ae08-9d7828e9f74a" />
screenshots/admin-products.png




## ✨ Features

### Customer Features

* User registration and login
* Google authentication
* User profile management
* Dynamic product listing
* Product detail pages
* Category-based browsing
* Cart management
* Wishlist management
* Checkout flow
* Razorpay payment integration
* Order history
* Order tracking
* Email order confirmation
* Fully responsive design

---

### Admin Features

* Secure admin dashboard
* Admin role management
* Multiple admin email access
* Product management

  * Add product
  * Edit product
  * Enable/disable product
  * Upload product images
  * Add product variants
* Category management

  * Add category
  * Edit category
  * Enable/disable category
* Order management

  * View customer orders
  * View order details
  * Update order status
* Shipping settings management
* Admin user management
* Dashboard analytics
* Clean sidebar-based admin UI

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* Firebase Authentication
* Google Login
* Email/Password Login

### Third-Party Services

* Cloudinary - Product image upload and storage
* Razorpay - Payment gateway
* Brevo - Email notifications
* MongoDB Atlas - Cloud database

### Deployment

* Frontend: Vercel
* Backend: Render / AWS / Node hosting
* Domain: skyrajewels.co.in

---

## 🏗️ Project Architecture

```text
SKYRA Jewels
│
├── Frontend - React + Vite
│   ├── Customer Storefront
│   ├── Authentication Pages
│   ├── Cart & Wishlist
│   ├── Checkout
│   ├── Order Pages
│   └── Admin Dashboard
│
├── Backend - Node.js + Express
│   ├── Auth APIs
│   ├── Product APIs
│   ├── Category APIs
│   ├── Cart APIs
│   ├── Wishlist APIs
│   ├── Order APIs
│   ├── Payment APIs
│   ├── Upload APIs
│   └── Admin APIs
│
├── Database - MongoDB
│
├── Authentication - Firebase
│
├── Image Storage - Cloudinary
│
├── Payment - Razorpay
│
└── Email - Brevo
```

---

## 📁 Folder Structure

```text
skyra-jewels-ecommerce/
│
├── src/
│   ├── components/
│   ├── components/admin/
│   ├── context/
│   ├── pages/
│   ├── pages/admin/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── public/
├── screenshots/
├── package.json
├── README.md
├── .env.example
└── .gitignore
```

---

## 🔐 Security Highlights

* Secret keys are stored in environment variables.
* Razorpay secret key is used only on the backend.
* Firebase private key is used only on the backend.
* MongoDB URI is never exposed to the frontend.
* Admin APIs are protected with admin middleware.
* User APIs are protected with authentication middleware.
* Users can access only their own orders.
* Payment status is updated only after Razorpay signature verification.
* Environment files are ignored using `.gitignore`.

---

## ⚙️ Environment Variables

Create `.env` files using the provided examples.

### Frontend `.env`

```env
VITE_API_URL=your_backend_api_url_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend `backend/.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=https://skyrajewels.co.in

MONGODB_URI=your_mongodb_connection_string

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=support@skyrajewels.co.in
EMAIL_FROM_NAME=Skyra Jewels
```

> Never commit real `.env` files to GitHub.

---

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/skyra-jewels-ecommerce.git
cd skyra-jewels-ecommerce
```

---

### 2. Install Frontend Dependencies

```bash
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

### 4. Configure Environment Variables

Create frontend `.env`:

```bash
cp .env.example .env
```

Create backend `.env`:

```bash
cd backend
cp .env.example .env
cd ..
```

Fill in all required environment variables.

---

### 5. Run Backend

```bash
cd backend
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

### 6. Run Frontend

Open another terminal:

```bash
npm run dev
```

Frontend will run on the Vite development URL shown in the terminal.

---

## 🧪 Testing

### Frontend Build

```bash
npm run build
```

### Backend Tests

```bash
cd backend
npm run test
```

### Lint Check

```bash
npm run lint
```

---

## 💳 Payment Flow

The payment flow is handled using Razorpay.

```text
Customer Checkout
        ↓
Backend Creates Razorpay Order
        ↓
Customer Completes Payment
        ↓
Backend Verifies Razorpay Signature
        ↓
Order Status Updated
        ↓
Customer and Admin Receive Email Notification
```

The Razorpay secret key is used only on the backend for security.

---

## 📦 Order Flow

```text
User adds product to cart
        ↓
User enters checkout details
        ↓
User completes Razorpay payment
        ↓
Order is created in MongoDB
        ↓
Admin can view order
        ↓
Admin updates order status
        ↓
User can track order status
```

---

## 🌐 Live Demo

Live Website:

https://skyrajewels.co.in

---

## 📌 Project Status

The project is completed and deployed as a full-stack e-commerce website.

Current status:

* Frontend completed
* Backend completed
* Authentication completed
* Admin dashboard completed
* Product management completed
* Cart and wishlist completed
* Razorpay payment integration completed
* Order management completed
* Email notification system completed
* Deployed with live domain

---

## 📚 What I Learned

While building this project, I gained hands-on experience in:

* Full-stack web development
* React application structure
* REST API development
* MongoDB database modeling
* Firebase authentication
* Admin dashboard development
* Payment gateway integration
* Email notification integration
* Image upload handling
* Deployment and domain setup
* Environment variable security
* Client-ready project preparation

## ⚠️ Important Note

This repository does not include real environment variables or secret keys. To run the project locally, create your own `.env` files using the provided `.env.example` files.

Do not expose:

* MongoDB URI
* Firebase private key
* Razorpay secret key
* Cloudinary secret
* Brevo API key

# Artisan Marketplace - Setup & Getting Started Guide

Welcome to your Artisan Marketplace! This guide will walk you through setting up the application locally and accessing the admin panel.

## Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages for both the frontend (Next.js) and backend (Express).

## Step 2: Setup Environment Variables

Create a `.env.local` file in the project root with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=dev_secret_key_12345
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Important:** Change `JWT_SECRET` to a strong, unique value in production.

## Step 3: Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Windows
# Start MongoDB from Services or run: mongod

# On Linux
sudo systemctl start mongod
```

## Step 4: Seed Database with Sample Products

Run the sample data script to populate the database with products and create an admin account:

```bash
node server/scripts/seedDatabase.js
```

**You will see:**
```
Admin Credentials:
Email: sajibuddin729@gmail.com
Password: **************
```

Save these credentials - you'll use them to login as admin!

## Step 5: Start the Application

Run both the frontend and backend servers simultaneously:

```bash
npm run dev
```

This command will start:
- **Frontend:** http://localhost:3000 (Next.js)
- **Backend:** http://localhost:5000 (Express API)

Wait for both servers to start before opening the browser.

## How to Access Admin Dashboard

### Step 1: Login as Admin
1. Go to http://localhost:3000
2. Click the **Login** button in the top-right corner
3. Enter the admin credentials:
   - **Email:** `sajibuddin729@gmail.com`
   - **Password:** `**************`

### Step 2: Access Admin Panel
After logging in:
1. Click on your **profile icon** (User icon in the header)
2. You'll see "Admin Dashboard" option (appears only for admin users)
3. Click **Admin Dashboard** to enter the admin panel

**Alternative URL:** You can also directly visit http://localhost:3000/admin

### Admin Dashboard Features

The admin panel allows you to:

1. **Dashboard Overview**
   - View total orders, users, products, and revenue
   - See recent orders at a glance

2. **Product Management** (http://localhost:3000/admin/products)
   - Add new products with images and descriptions
   - Edit existing products
   - Delete products
   - Manage inventory (stock levels)
   - Set prices and categories

3. **Order Management**
   - View all customer orders
   - Update order status (Pending → Shipped → Delivered)
   - View customer details and addresses
   - Track payment status

4. **User Management**
   - View all registered users
   - See user contact information
   - Monitor user activity

## Adding Products Manually

### Method 1: Using Admin Panel
1. Go to **Admin Dashboard** → **Products**
2. Click **Add New Product**
3. Fill in:
   - Product Name
   - Description
   - Price
   - Category (Home & Kitchen, Fashion & Accessories, etc.)
   - Stock Quantity
   - Image URL
4. Click **Save Product**

### Method 2: Using API (curl or Postman)

```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Product Name",
    "description": "Product description",
    "price": 29.99,
    "category": "Home & Kitchen",
    "stock": 50,
    "image": "https://image-url.jpg",
    "rating": 4.5,
    "reviews": 10
  }'
```

## Sample Products Already Included

The database has been seeded with 12 sample products including:
- Handmade Ceramic Mug
- Vintage Leather Wallet
- Organic Skin Care Set
- Handwoven Basket
- Artisan Jewelry Set
- Wooden Cutting Board
- Scented Candle Collection
- Bohemian Throw Pillow
- Silk Scarf
- Handmade Book
- Bamboo Plant Pot
- Coffee Lover Box

All products have beautiful Unsplash images, ratings, and stock levels.

## Features

### Customer Features
- Browse products by category
- Search for products
- Add to cart and checkout
- Cash on Delivery (COD) payment option
- Complete order with address, mobile number, and name
- User registration and login
- View order history
- Add reviews and ratings to products
- Save products to wishlist

### Admin Features
- Complete product management
- Order status tracking
- User management
- Dashboard analytics
- Order statistics
- Revenue tracking

## Troubleshooting

### MongoDB Connection Error
**Error:** `MongoDB connection error`
- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Verify your `MONGODB_URI` in `.env.local`

### API Connection Error
**Error:** `Failed to fetch products` or CORS error
- Ensure backend is running on port 5000
- Check that `NEXT_PUBLIC_API_URL` is set correctly to `http://localhost:5000/api`
- Make sure both servers are started with `npm run dev`

### Port Already in Use
**Error:** `Port 3000 or 5000 is already in use`
- Kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -i :3000  # or :5000
  kill -9 <PID>
  
  # On Windows
  netstat -ano | findstr :3000  # or :5000
  taskkill /PID <PID> /F
  ```

### Admin Link Not Showing
- Make sure you're logged in as admin user
- Verify the user has `isAdmin: true` in the database
- The admin credential provided (sajibuddin729@gmail.com) automatically has admin privileges

## File Structure

```
project/
├── app/                      # Next.js pages
│   ├── page.tsx             # Home page
│   ├── auth/                # Login/Register pages
│   ├── admin/               # Admin dashboard
│   ├── product/             # Product detail page
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout page
│   ├── orders/              # Order history
│   ├── profile/             # User profile
│   └── wishlist/            # Wishlist page
├── components/              # React components
│   └── admin/               # Admin components
├── server/                  # Backend Express app
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   └── scripts/             # Database scripts
├── lib/                     # Utilities
│   └── api.ts              # API client
└── public/                 # Static files
```

## Next Steps

1. Explore the application by visiting http://localhost:3000
2. Create a customer account and place a test order
3. Login as admin to manage products and orders
4. Customize colors, fonts, and branding as needed
5. Deploy to Vercel when ready for production

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/all` - Get all categories

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin Routes
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services (MongoDB, frontend, backend) are running
3. Check the Troubleshooting section above
4. Review the API response in browser dev tools Network tab

## Happy Selling! 🛍️

Your marketplace is ready to go. Start adding products and processing orders!

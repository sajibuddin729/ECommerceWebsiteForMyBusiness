# FusionBytePro - Premium Digital Marketplace

A beautiful, full-featured e-commerce marketplace built with Next.js, Express, MongoDB, and Tailwind CSS. Perfect for selling handmade and unique products with support for ratings, reviews, wishlists, and COD (Cash on Delivery) payments.

## Features

### Customer Features
- 🛍️ **Product Browsing** - Browse products by category with sorting and filtering
- 🛒 **Shopping Cart** - Add/remove items, manage quantities
- 💳 **Checkout** - COD (Cash on Delivery) payment method
- ❤️ **Wishlist** - Save favorite items for later
- ⭐ **Ratings & Reviews** - Leave and read product reviews
- 👤 **User Accounts** - Register, login, and manage profiles
- 📦 **Order Tracking** - View order status and details

### Admin Features
- 📊 **Dashboard** - View sales stats and key metrics
- 🏷️ **Product Management** - Add, edit, delete products
- 📋 **Order Management** - View, update order status
- 👥 **User Management** - View all users and their details
- 💰 **Revenue Tracking** - Monitor total revenue and sales

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **Shadcn/UI** - Beautiful UI components
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js & Express** - Server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
cd /vercel/share/v0-project
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_secret_key_here
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Create Admin User (First Time Setup)
You'll need to manually create an admin user in MongoDB:
```javascript
db.users.insertOne({
  "name": "fusionbytepro",
  email: "admin@example.com",
  password: "hashed_password", // Use bcrypt to hash
  phone: "9876543210",
  isAdmin: true,
  createdAt: new Date()
})
```

Or register normally, then manually set `isAdmin: true` in the database.

### 4. Add Sample Products
Use the Admin Dashboard (Products page) to add products, or insert them directly in MongoDB.

### 5. Start Development Servers
```bash
npm run dev
```

This starts both the Next.js frontend (port 3000) and Express backend (port 5000) concurrently.

### 6. Access the Application
- **User Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (if logged in as admin)
- **API**: http://localhost:5000/api

## Project Structure

```
/vercel/share/v0-project
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── auth/                    # Authentication pages
│   ├── product/[id]/            # Product detail page
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout process
│   ├── orders/                  # Order history
│   ├── wishlist/                # Wishlist
│   ├── profile/                 # User profile
│   ├── admin/                   # Admin dashboard
│   └── layout.tsx               # Root layout
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── Hero.tsx                 # Hero section
│   ├── ProductCard.tsx          # Product card component
│   ├── ProductGrid.tsx          # Products grid
│   ├── Footer.tsx               # Footer
│   └── admin/                   # Admin components
├── server/                      # Backend (Express)
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   └── server.js                # Main server file
├── public/                      # Static files
├── server.js                    # Express server entry
├── package.json
└── tailwind.config.ts           # Tailwind config
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories/all` - Get all categories

### Cart
- `POST /api/cart/validate` - Validate cart (client-side storage)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/product/:productId` - Get product reviews
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `GET /api/wishlist/check/:productId` - Check if wishlisted

### Admin
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users

## Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  avatar: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  stock: Number,
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  paymentMethod: String (default: 'COD'),
  status: String (Pending, Confirmed, Shipped, Delivered, Cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implemented

### ✅ Complete
- User authentication (Register, Login, Logout)
- Product listing with category filtering
- Product details and reviews
- Shopping cart management
- Multi-step checkout process
- COD payment method
- Order tracking
- User profiles with address management
- Wishlist functionality
- Ratings and reviews system
- Admin dashboard
- Product management (CRUD)
- Order management with status updates
- User management
- Revenue tracking and statistics
- Beautiful, responsive UI
- Mobile-friendly design

## Color Scheme
- **Primary**: Burnt Orange (`#C65D0B`)
- **Secondary**: Golden Yellow (`#F4A12E`)
- **Accent**: Coral Red (`#E6306F`)
- **Neutrals**: Off-white, Grays, Dark gray

## Customization

### Change Colors
Edit `/app/globals.css` and update the CSS variables:
```css
--primary: 17 88% 40%;
--secondary: 40 89% 46%;
--accent: 340 60% 50%;
```

### Change Fonts
Edit `/app/layout.tsx` to import different Google Fonts:
```tsx
import { Poppins, Playfair_Display } from 'next/font/google'
```

### Change Brand Name
Replace "Artisan" with your brand name in:
- `/components/Header.tsx`
- `/components/Hero.tsx`
- `/components/Footer.tsx`

## Deployment

### Deploy Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Deploy Backend
You can deploy the Express server to:
- Vercel (with serverless functions)
- Heroku
- Railway
- AWS EC2
- DigitalOcean
- Render

Example for Heroku:
```bash
git push heroku main
```

## Future Enhancements
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Email notifications
- [ ] Seller accounts and multi-vendor support
- [ ] Advanced search with Elasticsearch
- [ ] Product recommendations
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Bulk order operations
- [ ] Customer support chat
- [ ] Mobile app (React Native)

## License
MIT

## Support
For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using modern web technologies**

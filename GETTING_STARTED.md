# Getting Started - Artisan Marketplace

## What You Have

A complete, beautiful e-commerce marketplace with:
- User registration & authentication
- Product browsing and search
- Shopping cart & checkout
- Order management
- Admin panel to control everything
- Ratings and reviews
- Wishlist feature

## Quick Setup (5 Minutes)

### 1. Start MongoDB
```bash
mongod
```

### 2. Install Packages
```bash
npm install
```

### 3. Seed Sample Data (Creates Admin Account)
```bash
npm run seed
```

### 4. Start Application
```bash
npm run dev
```

### 5. Login as Admin
- Visit http://localhost:3000
- Click "Login"
- Email: `sajibuddin729@gmail.com`
- Password: `**************`
- Click user icon → "Admin Dashboard"

## Project Structure

```
Your Marketplace/
│
├── Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx          → Homepage with products
│   │   ├── admin/            → Admin dashboard
│   │   ├── auth/             → Login & Register
│   │   ├── cart/             → Shopping cart
│   │   ├── checkout/         → Checkout page
│   │   ├── orders/           → Order history
│   │   ├── product/          → Product details
│   │   ├── profile/          → User profile
│   │   └── wishlist/         → Saved items
│   └── components/           → React components
│
├── Backend (Express + MongoDB)
│   └── server/
│       ├── models/           → Database schemas
│       ├── routes/           → API endpoints
│       ├── middleware/       → Authentication
│       └── scripts/          → Database seed
│
└── Documentation
    ├── QUICKSTART.md         → 5-minute setup
    ├── SETUP.md              → Detailed setup
    ├── ADMIN_GUIDE.md        → Admin features
    └── README.md             → Project overview
```

## Key Accounts

### Admin Account (Created by Seed Script)
```
Email: sajibuddin729@gmail.com
Password: **************
Full Access: ✅
```

### Test Customer (Optional)
Create your own by:
1. Clicking "Sign Up" instead of "Login"
2. Fill in your details
3. You'll be logged in automatically

## Feature Overview

### For Customers

**Homepage**
- Browse all products
- Filter by category
- Search products
- Add to cart

**Product Page**
- Detailed product info
- Customer reviews & ratings
- Add to wishlist
- Add to cart with quantity

**Shopping Cart**
- View all items
- Adjust quantities
- See total price
- Proceed to checkout

**Checkout**
- Enter delivery address
- Enter phone number
- Confirm order details
- Place order (COD)

**Order History**
- View all your orders
- See order status
- Track delivery progress

**Wishlist**
- Save favorite items
- View all saved items
- Move to cart

**Account**
- Update profile
- Change password
- View contact info
- Manage addresses

### For Admin

**Dashboard**
- See total orders count
- See total users
- See total products
- See total revenue
- View recent orders

**Product Management**
- Add new products
- Edit existing products
- Delete products
- Manage stock levels
- Update pricing

**Order Management**
- View all orders
- See customer details
- See delivery addresses
- Update order status
- Track payments

**User Management**
- View all customers
- See user details
- View registration date

## Navigation Guide

### Getting to Admin (After Login)

```
Homepage
   ↓
Click User Icon (Top Right)
   ↓
See Dropdown Menu
   ↓
Click "Admin Dashboard"
   ↓
Admin Dashboard Opens
   ↓
See Products/Orders/Users in Sidebar
```

### Or Direct URLs

- Homepage: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Cart: http://localhost:3000/cart
- Admin: http://localhost:3000/admin (if logged in as admin)
- Products: http://localhost:3000/admin/products

## Common Tasks

### Add a Product

1. Go to Admin Dashboard
2. Click "Products" in sidebar
3. Click "Add New Product"
4. Fill in details:
   - Name
   - Description
   - Price
   - Category
   - Stock quantity
   - Image URL
5. Click "Save"

**Image URLs:**
- Unsplash.com (free stock photos)
- Pexels.com (free stock photos)
- Your own hosted images

### Manage Orders

1. Go to Admin Dashboard
2. Look for "Recent Orders"
3. Click on an order
4. Click "Update Status"
5. Change status:
   - Pending → Shipped → Delivered
6. Click "Update"

### Check Sales

1. Go to Admin Dashboard
2. Look at stats cards:
   - Total Orders: How many orders placed
   - Revenue: Total money value
   - Users: How many customers
   - Products: How many items

### Accept an Order

**Workflow:**
1. Order placed by customer (Status: Pending)
2. You verify address and details
3. Pick product from inventory
4. Pack and prepare shipment
5. Update status to "Shipped"
6. Customer receives
7. Update status to "Delivered"

## Customization

### Change Colors

Edit `app/globals.css` and update color values:
```css
:root {
  --primary: 17 88% 40%;          /* Main brand color */
  --secondary: 40 89% 46%;        /* Accent color */
  --accent: 340 60% 50%;          /* Highlight color */
}
```

### Change Store Name

1. Edit `components/Header.tsx`
2. Find `<Link href="/" className="text-2xl font-bold text-primary">`
3. Change "Artisan" to your store name

### Change Homepage Content

Edit `components/Hero.tsx` to update:
- Headline
- Subtitle
- Background image
- Call-to-action button

### Add New Pages

1. Create new file in `app/` folder
2. Example: `app/about/page.tsx`
3. Add to header navigation in `components/Header.tsx`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
- Make sure `mongod` is running
- Check `MONGODB_URI` in `.env.local`
- Default should be: `mongodb://localhost:27017/marketplace`

### Admin Button Not Showing
- You must be logged in as the admin user
- The sajibuddin729@gmail.com account has admin privileges
- Customer accounts won't see the Admin Dashboard button

### Products Not Loading
- Check backend is running (port 5000)
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Look at browser console for error messages

### Can't Login
- Check email is correct (case-sensitive)
- Verify password exactly
- Make sure database is connected
- Try refreshing page

## Next Steps

1. **Explore** - Walk through the whole app as customer
2. **Add Products** - Add your first product from admin
3. **Test Order** - Place a test order as customer
4. **Manage** - Process the order from admin
5. **Customize** - Update colors and branding
6. **Deploy** - Host on Vercel when ready

## Documentation Files

- **QUICKSTART.md** - 5-minute quick setup
- **SETUP.md** - Complete setup instructions
- **ADMIN_GUIDE.md** - Full admin feature guide
- **README.md** - Project overview

## Support Resources

### Frontend Issues
- Check browser console (F12 → Console)
- Check Network tab for API errors
- Verify `.env.local` has correct API URL

### Backend Issues
- Check terminal output for errors
- Verify MongoDB is running
- Check `.env.local` has MongoDB connection

### Database Issues
- Ensure MongoDB daemon is running
- Check database is created: `mongodb://localhost:27017/marketplace`
- Re-run seed script if needed: `npm run seed`

## Sample Admin Tasks

### Day 1: Setup
- [ ] Run seed script
- [ ] Login as admin
- [ ] Review dashboard
- [ ] Check sample products

### Day 2: Customize
- [ ] Update store name
- [ ] Change colors
- [ ] Add your logo
- [ ] Update hero section

### Day 3: Add Products
- [ ] Add 5 new products
- [ ] Set accurate prices
- [ ] Upload product images
- [ ] Organize by category

### Day 4: Test Orders
- [ ] Create customer account
- [ ] Add products to cart
- [ ] Place test order
- [ ] Update order status
- [ ] Mark as delivered

### Day 5: Go Live
- [ ] Review all content
- [ ] Test all features
- [ ] Deploy to Vercel
- [ ] Share with users

## Ready to Go!

Your marketplace is fully set up with:
- ✅ 12 sample products with images
- ✅ Admin account for management
- ✅ Customer registration & login
- ✅ Complete shopping experience
- ✅ Order management system
- ✅ Beautiful responsive design

Start at http://localhost:3000 and explore!

---

**Questions?** Check the other documentation files for detailed information.

# START HERE - Artisan Marketplace

## What You Just Got

A production-ready e-commerce marketplace with:
- Beautiful, modern design
- 12 sample products with real images
- Complete admin control panel
- User accounts & authentication
- Shopping cart & checkout
- Order management
- Product ratings & reviews
- Wishlist feature
- Cash on Delivery (COD) payment

## 5-Minute Setup

### Step 1: Make Sure MongoDB is Running
```bash
# Open a NEW terminal and start MongoDB
mongod
```

### Step 2: Install Everything
```bash
npm install
```

### Step 3: Add Sample Data & Create Admin Account
```bash
npm run seed
```

**You'll see:**
```
Admin Email: sajibuddin729@gmail.com
Admin Password: **************
```

### Step 4: Start Everything
```bash
npm run dev
```

The app will start on http://localhost:3000

### Step 5: Access Admin Dashboard

1. Go to http://localhost:3000
2. Click **Login** button (top right)
3. Enter:
   - Email: `sajibuddin729@gmail.com`
   - Password: `**************`
4. Click the **User Icon** (top right)
5. Click **Admin Dashboard**

## That's It! You're In! 🎉

You now have full admin access to:
- Add/edit/delete products
- Manage customer orders
- View sales statistics
- Control inventory

## Sample Products Included

The database already has 12 beautiful products:
- Handmade Ceramic Mug ($25.99)
- Vintage Leather Wallet ($45.99)
- Organic Skin Care Set ($59.99)
- Handwoven Basket ($35.99)
- Artisan Jewelry Set ($89.99)
- Wooden Cutting Board ($39.99)
- Scented Candle Collection ($49.99)
- Bohemian Throw Pillow ($32.99)
- Silk Scarf ($55.99)
- Handmade Book ($28.99)
- Bamboo Plant Pot ($22.99)
- Coffee Lover Box ($72.99)

All with beautiful images from Unsplash!

## Where to Find Everything

### Customer Side (Anyone can use)
- Homepage: http://localhost:3000
- Login: Click "Login" button
- Register: Click "Sign Up" button
- Products: Browse on homepage
- Cart: Click cart icon
- Wishlist: Click heart icon
- Orders: Check order history

### Admin Side (admin@marketplace.com only)
- Dashboard: http://localhost:3000/admin
- Products: Click "Products" in sidebar
- Orders: Click "Orders" in sidebar
- Users: Click "Users" in sidebar
- Stats: View on dashboard

## How to Find Admin Control

### Method 1: Via User Menu
```
Homepage → Click User Icon (Top Right) 
         → See Dropdown Menu
         → Click "Admin Dashboard"
```

### Method 2: Direct URL
```
http://localhost:3000/admin
```
(Only works if logged in as admin)

### Method 3: From Login Page
```
Login as admin@marketplace.com
→ Dashboard auto-shows recent orders
→ Left sidebar has navigation
```

## Key Admin Features

### Dashboard Tab
- View total orders, users, products
- See total revenue
- Quick access to recent orders
- All on one page

### Products Tab
- View all products
- Add new product (name, price, image, stock)
- Edit product details
- Delete old products
- Manage inventory levels

### Orders Tab
- View all customer orders
- See customer name, email, phone, address
- See items ordered
- Update order status:
  - Pending → Shipped → Delivered
- Track payment status

### Users Tab
- View all registered customers
- See email, phone, address
- See registration date

## Common Admin Tasks

### Add a New Product
1. Go to Admin Dashboard → Products tab
2. Click "Add New Product"
3. Fill in:
   - Product Name
   - Description
   - Price
   - Category (Home & Kitchen, Fashion, etc.)
   - Stock Quantity
   - Image URL (get from Unsplash, Pexels, or your server)
4. Click "Save"

### Process an Order
1. Customer places order
2. Status shows as "Pending"
3. You verify address and details
4. Pack and prepare shipment
5. Update status to "Shipped"
6. When customer receives:
7. Update status to "Delivered"

### View Sales Statistics
Just look at the dashboard cards:
- **Total Orders**: How many orders placed
- **Total Users**: How many customers registered
- **Total Products**: Items in your store
- **Revenue**: Total money from all orders

## Important Credentials

```
Admin Email:    sajibuddin729@gmail.com
Admin Password: **************

This account has:
✅ Add/edit products
✅ Manage orders
✅ View all users
✅ Access statistics
✅ Full store control
```

## All Documentation Files

- **QUICKSTART.md** - 5-minute setup (you just did this)
- **SETUP.md** - Detailed setup & troubleshooting
- **ADMIN_GUIDE.md** - Complete admin features guide
- **GETTING_STARTED.md** - Full feature walkthrough
- **README.md** - Project technical overview

## Quick Troubleshooting

**Problem:** Admin button not showing
- Make sure you're logged in as admin@marketplace.com
- If using a customer account, you won't see it
- Always use the exact admin email

**Problem:** Products not loading
- Check MongoDB is running (open terminal and run `mongod`)
- Check backend is running (should say "Server running on port 5000")
- Verify `.env.local` file exists with correct values

**Problem:** Can't login
- Check email is exactly: `admin@marketplace.com`
- Check password is exactly: `**************`
- Make sure database was seeded: `npm run seed`

**Problem:** Port 3000 or 5000 already in use
- Kill the process using that port
- Or change PORT in `.env.local`
- Then restart: `npm run dev`

## Next Steps

1. **Explore as Customer** - Add products to cart, checkout
2. **Review Sample Products** - See what's included
3. **Add Your First Product** - Practice adding to store
4. **Place Test Order** - Process an order end-to-end
5. **Customize** - Change colors, store name, images
6. **Deploy** - Host on Vercel when ready

## File Structure (For Reference)

```
/app              → Customer pages (homepage, cart, orders, etc)
/components       → React components (header, product card, etc)
/server           → Express backend (API, database, auth)
/lib              → Utilities (API client)
/public           → Static files

Key Files:
- app/page.tsx           → Homepage
- components/Header.tsx  → Top navigation
- server/server.js       → Express server
- server/models/         → Database schemas
- server/routes/         → API endpoints
```

## That's All You Need!

Your marketplace is ready. Just:

1. Keep `mongod` running in one terminal
2. Run `npm run dev` in another terminal
3. Visit http://localhost:3000
4. Login with sajibuddin729@gmail.com
5. Start managing your store!

## Need Help?

- Check SETUP.md for detailed setup
- Check ADMIN_GUIDE.md for feature details
- Check GETTING_STARTED.md for full walkthrough
- Look at terminal output for errors
- Check browser console (F12) for errors

---

## You're All Set! 🚀

Go to http://localhost:3000 and start selling!

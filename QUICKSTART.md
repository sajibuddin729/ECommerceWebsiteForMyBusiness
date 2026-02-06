# Quick Start - 5 Minutes to Admin Dashboard

## Prerequisites
- Node.js installed
- MongoDB running locally (`mongod`)

## Step 1: Install (1 minute)
```bash
npm install
```

## Step 2: Setup Environment (30 seconds)
The `.env.local` file is already configured. Make sure it exists with:
```env
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=dev_secret_key_12345
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 3: Seed Database with Sample Data (1 minute)
```bash
node server/scripts/seedDatabase.js
```

**Output will show:**
```
Admin Credentials:
Email: sajibuddin729@gmail.com
Password: **************
```

## Step 4: Start Everything (1 minute)
```bash
npm run dev
```

Wait for both servers to start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Step 5: Access Admin Dashboard (30 seconds)

### Option A: Via Login Page
1. Go to http://localhost:3000
2. Click **Login** button (top right)
3. Enter:
   - Email: `sajibuddin729@gmail.com`
   - Password: `**************`
4. Click user icon → **Admin Dashboard**

### Option B: Direct URL
If logged in as admin, visit: http://localhost:3000/admin

## What's Ready

✅ 12 sample products with images (from Unsplash)
✅ Admin account created
✅ Customer registration/login working
✅ Shopping cart & checkout
✅ Order management
✅ Product management
✅ Ratings & reviews
✅ Wishlist feature

## Admin Panel Sections

**Dashboard** (http://localhost:3000/admin)
- Overview stats
- Recent orders
- Quick actions

**Products** (http://localhost:3000/admin/products)
- View all products
- Add new products
- Edit/delete products
- Manage inventory

## Add Your First Product

1. Login as admin
2. Go to **Admin Dashboard** → **Products**
3. Click **Add New Product**
4. Fill in:
   - Name: `My Product`
   - Price: `29.99`
   - Category: `Home & Kitchen`
   - Stock: `50`
   - Image URL: Any image URL
5. Click **Save**

## Troubleshooting

**MongoDB not connecting?**
- Make sure `mongod` is running
- Check `MONGODB_URI` in `.env.local`

**API errors?**
- Verify `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `.env.local`
- Check both servers are running: `npm run dev`

**Admin button not showing?**
- Verify you're logged in as `sajibuddin729@gmail.com`
- Re-run seed script if user was deleted

**Ports in use?**
- Kill existing processes on ports 3000 and 5000
- Or change PORT in `.env.local`

## Next Steps

1. Explore the marketplace at http://localhost:3000
2. Create a test customer account
3. Place a test order
4. Manage orders from admin dashboard
5. Add your own products
6. Customize colors/branding in `globals.css`

For detailed setup, see [SETUP.md](./SETUP.md)

---

**Questions?** Check SETUP.md for comprehensive documentation.

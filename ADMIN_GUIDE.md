# Admin Dashboard - Complete Guide

## Accessing the Admin Dashboard

### Login Method
1. Visit http://localhost:3000
2. Click the **Login** button in top-right corner
3. Enter your admin credentials:
   - **Email:** sajibuddin729@gmail.com
   - **Password:** **************
4. Click **Login**

### After Login
1. Click the **User Icon** (top-right corner)
2. A dropdown menu appears showing:
   - Your name and email
   - "My Profile" link
   - "My Orders" link
   - **"Admin Dashboard"** link (only visible if you're admin)
3. Click **"Admin Dashboard"**

### Direct URL
Once logged in as admin, you can also visit directly:
- **Dashboard:** http://localhost:3000/admin
- **Products:** http://localhost:3000/admin/products

## Dashboard Overview

The admin dashboard shows key metrics at a glance:

```
┌─────────────────────────────────────────────────────┐
│                  Admin Dashboard                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Total Orders    Total Users    Products    Revenue │
│      42              15            12       $3,240  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Recent Orders                        │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Order #1 | Customer | Amount | Status      │  │
│  │ Order #2 | Customer | Amount | Status      │  │
│  │ Order #3 | Customer | Amount | Status      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Stats Cards

**Total Orders**
- Number of orders ever placed
- Updates in real-time

**Total Users**
- Number of registered customers
- Includes admin users

**Products**
- Total products in your catalog
- Includes out-of-stock items

**Revenue**
- Total amount from completed orders
- For COD orders: shows full order value

## Product Management

### Access Products Page
From Admin Dashboard:
1. Look for **"Products"** link in left sidebar (if available)
2. Or navigate directly: http://localhost:3000/admin/products

### Adding a New Product

**Steps:**
1. Click **"Add New Product"** button
2. Fill in the form:

| Field | Example | Required |
|-------|---------|----------|
| Product Name | Handmade Ceramic Mug | Yes |
| Description | Beautiful handcrafted ceramic mug... | Yes |
| Price | 25.99 | Yes |
| Category | Home & Kitchen | Yes |
| Stock Quantity | 50 | Yes |
| Image URL | https://image-url.jpg | Yes |
| Rating | 4.5 | No (default: 0) |
| Reviews | 8 | No (default: 0) |

**Categories Available:**
- Home & Kitchen
- Fashion & Accessories
- Beauty & Personal Care
- Art & Crafts
- Food & Beverages
- Other

3. Click **"Save Product"**

**Image URL Tips:**
- Use Unsplash images: https://unsplash.com/
- Use Pexels: https://www.pexels.com/
- Use your own hosted images
- Try: `https://images.unsplash.com/photo-[id]?w=500&h=500&fit=crop`

### Editing Products

1. On Products page, find the product
2. Click **"Edit"** button
3. Modify any fields
4. Click **"Save Changes"**

### Deleting Products

1. On Products page, find the product
2. Click **"Delete"** button
3. Confirm deletion

**Note:** Deleting a product will remove it from search results but old orders will retain product information.

### Managing Stock

1. Go to Products page
2. Find the product
3. Click **"Edit"**
4. Update the "Stock Quantity" field
5. Click **"Save Changes"**

When stock reaches 0, the product is marked as "Out of Stock" on the customer side.

## Order Management

### View All Orders

**On Dashboard:**
- Recent orders are shown automatically
- Shows last 5-10 orders

**Dedicated Orders Page (if available):**
- http://localhost:3000/admin/orders
- Shows all orders with filters

### Order Information

Each order displays:
- **Order ID:** Unique identifier
- **Customer Name:** Who placed the order
- **Email & Phone:** Customer contact info
- **Delivery Address:** Full address with street, city, state, pincode
- **Items:** Product names and quantities
- **Total Amount:** Sum of all items
- **Status:** Current order status
- **Payment Method:** COD (Cash on Delivery)
- **Order Date:** When order was placed

### Order Status Workflow

Orders progress through these statuses:

```
Pending → Shipped → Delivered
   ↓
Cancelled
```

**Status Meanings:**
- **Pending:** Order received, awaiting processing
- **Shipped:** Order is in transit to customer
- **Delivered:** Order reached the customer
- **Cancelled:** Order was cancelled

### Updating Order Status

1. Find the order on dashboard or orders page
2. Click on the order or **"View Details"**
3. Click the **"Update Status"** button
4. Select new status from dropdown
5. Click **"Update"**

**Example Flow:**
1. Customer places order → Status: **Pending**
2. You pick and pack → Change to **Pending** (confirm picking)
3. Hand to courier → Change to **Shipped**
4. Customer receives → Change to **Delivered**

## User Management

### View All Users

**Access Users:**
1. Dashboard → Users section (if available)
2. Or: http://localhost:3000/admin/users

### User Information

Each user record shows:
- **Name:** Full name
- **Email:** Email address (unique per user)
- **Phone:** Contact number
- **Address:** Street, city, state, pincode
- **Admin Status:** Whether they're an admin
- **Join Date:** When they registered

### Admin Privileges

**Making a User Admin:**
- Currently can only be done via database or API
- Contact system administrator

**Removing Admin:**
- Keep the admin@marketplace.com account for yourself
- Don't delete the only admin account

## Dashboard Statistics

### Understanding the Numbers

**Total Orders**
- Counts all orders regardless of status
- Pending, Shipped, Delivered, and Cancelled orders

**Total Users**
- Active user accounts
- Includes customers and admins

**Total Products**
- All products in catalog
- In stock and out of stock

**Revenue**
- Total value of all orders
- For COD: full order amount shown (not yet collected)
- Only counts completed orders (delivered/shipped)

### Using Stats for Business

**High Sales Days:**
- Monitor total orders for trends
- Rush seasons show increase in orders

**User Growth:**
- Track total users over time
- Plan inventory based on growth

**Product Performance:**
- Check individual product sales via orders
- Popular products may need more stock

## Daily Tasks

### Morning Check
1. Login to dashboard
2. Check **Recent Orders** for overnight orders
3. Verify product stock levels
4. Update any "Pending" orders to "Shipped" if sent

### Order Processing
1. View pending orders
2. Pick products from inventory
3. Verify customer address
4. Mark as "Shipped" when handed to courier
5. Update to "Delivered" when confirmed

### Stock Management
1. Check stock levels daily
2. Add stock when items run low
3. Remove out-of-stock products or update quantity to 0

### Adding Products
1. Add new products in bulk if doing regular updates
2. Fill accurate descriptions
3. Add beautiful images (Unsplash is great)
4. Set correct prices and categories

## Tips & Best Practices

### Product Images
- Use high-quality images (500x500px minimum)
- Use consistent style
- Show product clearly
- Include multiple angles if possible

### Pricing Strategy
- Price competitively
- Consider production costs
- Add margin for profit
- Keep prices consistent

### Stock Management
- Never oversell
- Update quantities daily
- Alert when stock is low (under 5 units)
- Plan restocking based on demand

### Customer Service
- Check customer details before shipping
- Verify addresses are complete
- Contact customer if address seems incomplete
- Update order status promptly

### Product Descriptions
- Be clear and detailed
- Mention materials, dimensions, weight
- Highlight unique selling points
- Include care instructions if relevant

## Common Issues

### Can't See Admin Dashboard Link?
- Make sure you're logged in as admin user
- Check your account has `isAdmin: true`
- Try logging out and logging back in
- Re-run seed script if needed

### Orders Not Showing?
- Refresh the page
- Check if orders are actually placed
- Verify backend is running (port 5000)

### Can't Add Products?
- Check if you're actually admin
- Verify all required fields are filled
- Check if image URL is valid
- Look for error messages in browser console

### Product Images Not Loading?
- Verify image URL is accessible in browser
- Use HTTPS URLs if possible
- Try different image source

### Stock Not Updating?
- Refresh the page
- Check if changes were saved
- Verify new quantity was entered

## API Endpoints (for advanced users)

### Add Product
```bash
POST /api/admin/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 29.99,
  "category": "Home & Kitchen",
  "stock": 50,
  "image": "https://image-url.jpg"
}
```

### Update Order Status
```bash
PUT /api/admin/orders/:orderId
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "Shipped"
}
```

### Get Dashboard Stats
```bash
GET /api/admin/stats
Authorization: Bearer YOUR_TOKEN
```

## Getting Admin Token

Your admin token is stored in browser storage:
```javascript
// In browser console
localStorage.getItem('token')
```

## Support

- Check SETUP.md for installation help
- Check QUICKSTART.md for quick start
- Review README.md for project overview

---

**Happy Managing!** Your marketplace is ready to grow.

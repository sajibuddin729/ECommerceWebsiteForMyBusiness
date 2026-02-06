const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');

dotenv.config({ path: '.env.local' });

const app = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Sanitize user input from XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased for Base64 image uploads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const cartRoutes = require('./server/routes/cart');
const orderRoutes = require('./server/routes/orders');
const reviewRoutes = require('./server/routes/reviews');
const wishlistRoutes = require('./server/routes/wishlist');
const adminRoutes = require('./server/routes/admin');
const pageRoutes = require('./server/routes/pages');
const settingsRoutes = require('./server/routes/settings');


// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/settings', settingsRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

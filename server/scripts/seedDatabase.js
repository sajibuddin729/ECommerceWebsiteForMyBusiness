const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config({ path: '.env.local' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'sajibuddin729@gmail.com',
      password: '**************',
      phone: '9876543210',
      isAdmin: true,
      address: {
        street: '123 Admin St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        country: 'USA',
      },
    });
    console.log('Admin user created:', adminUser.email);

    // Create sample products
    const products = [
      {
        name: 'Handmade Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug perfect for morning coffee',
        price: 25.99,
        category: 'Home & Kitchen',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
        rating: 4.5,
        reviews: 8,
      },
      {
        name: 'Vintage Leather Wallet',
        description: 'Premium leather wallet with classic design and multiple card slots',
        price: 45.99,
        category: 'Fashion & Accessories',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
        rating: 4.8,
        reviews: 12,
      },
      {
        name: 'Organic Skin Care Set',
        description: 'Complete skincare routine with natural organic ingredients',
        price: 59.99,
        category: 'Beauty & Personal Care',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        rating: 4.6,
        reviews: 15,
      },
      {
        name: 'Handwoven Basket',
        description: 'Decorative basket handwoven from natural jute fiber',
        price: 35.99,
        category: 'Home & Kitchen',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1595521624202-af34daa5b3ce?w=500&h=500&fit=crop',
        rating: 4.4,
        reviews: 7,
      },
      {
        name: 'Artisan Jewelry Set',
        description: 'Unique handmade jewelry set with semi-precious stones',
        price: 89.99,
        category: 'Fashion & Accessories',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
        rating: 4.9,
        reviews: 20,
      },
      {
        name: 'Wooden Cutting Board',
        description: 'Premium hardwood cutting board suitable for all food preparation',
        price: 39.99,
        category: 'Home & Kitchen',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
        rating: 4.7,
        reviews: 11,
      },
      {
        name: 'Scented Candle Collection',
        description: 'Set of 3 premium scented candles with natural wax',
        price: 49.99,
        category: 'Home & Kitchen',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1615996001890-d1a1e92f6b3d?w=500&h=500&fit=crop',
        rating: 4.5,
        reviews: 18,
      },
      {
        name: 'Bohemian Throw Pillow',
        description: 'Colorful embroidered throw pillow for living room decor',
        price: 32.99,
        category: 'Home & Kitchen',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1584100936595-c5a2ad0ab378?w=500&h=500&fit=crop',
        rating: 4.6,
        reviews: 9,
      },
      {
        name: 'Silk Scarf',
        description: 'Lightweight pure silk scarf with hand-painted design',
        price: 55.99,
        category: 'Fashion & Accessories',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
        rating: 4.7,
        reviews: 13,
      },
      {
        name: 'Handmade Book',
        description: 'Limited edition handmade leather-bound journal notebook',
        price: 28.99,
        category: 'Art & Crafts',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1507842217343-583b8c1b4c2f?w=500&h=500&fit=crop',
        rating: 4.8,
        reviews: 14,
      },
      {
        name: 'Bamboo Plant Pot',
        description: 'Eco-friendly bamboo pot with drainage for indoor plants',
        price: 22.99,
        category: 'Home & Kitchen',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1612833504981-2ef9d9c36bff?w=500&h=500&fit=crop',
        rating: 4.4,
        reviews: 6,
      },
      {
        name: 'Coffee Lover Box',
        description: 'Premium assorted coffee beans from around the world',
        price: 72.99,
        category: 'Food & Beverages',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop',
        rating: 4.9,
        reviews: 22,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} sample products`);

    console.log('\n========== SETUP COMPLETE ==========');
    console.log('Admin Credentials:');
    console.log('Email: sajibuddin729@gmail.com');
    console.log('Password: **************');
    console.log('=====================================\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();

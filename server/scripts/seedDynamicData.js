const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Page = require('../models/Page');
const Settings = require('../models/Settings');

dotenv.config({ path: '.env.local' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
        console.log('Connected to MongoDB');

        const pages = [
            { title: 'About Us', slug: 'about-us', content: '<h1>About Us</h1><p>Welcome to FusionBytePro!</p>' },
            { title: 'Contact Us', slug: 'contact', content: '<h1>Contact Us</h1><p>Get in touch with us.</p>' },
            { title: 'Blog', slug: 'blog', content: '<h1>Blog</h1><p>Read our latest stories.</p>' },
            { title: 'Careers', slug: 'careers', content: '<h1>Careers</h1><p>Join our team.</p>' },
            { title: 'FAQ', slug: 'faq', content: '<h1>FAQ</h1><p>Frequently asked questions.</p>' },
            { title: 'Shipping Info', slug: 'shipping-info', content: '<h1>Shipping Info</h1><p>How we ship your items.</p>' },
            { title: 'Returns', slug: 'returns', content: '<h1>Returns</h1><p>Our return policy.</p>' },
            { title: 'Privacy Policy', slug: 'privacy-policy', content: '<h1>Privacy Policy</h1><p>Your privacy matters.</p>' },
            { title: 'Terms & Conditions', slug: 'terms', content: '<h1>Terms & Conditions</h1><p>Rules of the game.</p>' },
        ];

        for (const page of pages) {
            await Page.findOneAndUpdate({ slug: page.slug }, page, { upsert: true, new: true });
            console.log(`Seeded page: ${page.slug}`);
        }

        const initialSettings = {
            socialLinks: {
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                twitter: 'https://twitter.com',
                linkedin: 'https://linkedin.com'
            },
            contactInfo: {
                email: 'support@fusionbytepro.com',
                phone: '+1 234 567 890',
                address: '123 Tech Avenue, Silicon Valley'
            },
            appearance: {
                logo: '',
                favicon: 'https://img.icons8.com/shrike/128/6366f1/shopping-bag.png',
                primaryColor: '#6366f1',
                secondaryColor: '#a855f7',
                accentColor: '#f43f5e',
                heroTitle: 'Elevate Your Marketplace Experience',
                heroSubtitle: 'Discover premium apparel, footwear, cutting-edge electronics, and innovative digital solutions from top creators worldwide.'
            }
        };

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(initialSettings);
        } else {
            // Update existing settings with defaults if missing
            settings.appearance = settings.appearance || initialSettings.appearance;
        }
        await settings.save();
        console.log('Seeded settings');

        console.log('Seeding complete');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();

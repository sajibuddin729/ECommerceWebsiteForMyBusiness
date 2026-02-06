const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Page = require('../models/Page');

dotenv.config({ path: '.env.local' });

const seedPages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for page seeding');

        const defaultPages = [
            {
                title: 'Shop Our Collections',
                slug: 'shop',
                content: `
          <h1>Explore Our Artisan Market</h1>
          <p>Discover a curated selection of handmade treasures from talented artisans around the world.</p>
          <p>Whether you're looking for unique jewelry, cozy home decor, or sustainable fashion, we have something special for everyone.</p>
        `,
            },
            {
                title: 'About Our Story',
                slug: 'about',
                content: `
          <h1>The Heart of Handcrafted</h1>
          <p>We started with a simple belief: that every object has a story.</p>
          <p>Our platform connects curious shoppers with independent creators who pour their passion into every piece they make.</p>
          <p>By shopping here, you're not just buying a product; you're supporting an artist's dream and preserving traditional craftsmanship.</p>
        `,
            },
            {
                title: 'Get in Touch',
                slug: 'contact',
                content: `
          <h1>We'd Love to Hear From You</h1>
          <p>Have questions about a product? Want to collaborate? Or just want to say hi?</p>
          <p>You can reach us at support@artisanmarket.com or through our social media channels.</p>
          <p>Our team is here to help you find that perfect handmade treasure.</p>
        `,
            },
        ];

        for (const pageData of defaultPages) {
            await Page.findOneAndUpdate(
                { slug: pageData.slug },
                pageData,
                { upsert: true, new: true }
            );
        }

        console.log('CMS pages seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding pages:', error);
        process.exit(1);
    }
};

seedPages();

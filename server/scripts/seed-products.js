const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';

// Helper function to create slug from name
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// 20 diverse handmade products with SEO optimization
const products = [
    // Jewelry (5 products)
    {
        name: 'Turquoise Gold Pendant Necklace',
        slug: 'turquoise-gold-pendant-necklace',
        description: 'Exquisite handcrafted gold necklace featuring a stunning natural turquoise gemstone pendant. Each piece is uniquely made by skilled artisans, perfect for adding elegance to any outfit.',
        price: 89.99,
        category: 'Jewelry',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
        rating: 4.8,
        reviewCount: 24,
        metaTitle: 'Handmade Turquoise Gold Necklace | Artisan Jewelry',
        metaDescription: 'Shop our handcrafted turquoise gold pendant necklace. Unique artisan jewelry made with natural gemstones. Free shipping on orders over $50.',
        keywords: ['turquoise necklace', 'gold pendant', 'handmade jewelry', 'gemstone necklace', 'artisan necklace'],
        featured: true,
    },
    {
        name: 'Silver Mandala Hoop Earrings',
        slug: 'silver-mandala-hoop-earrings',
        description: 'Intricate handmade silver hoop earrings with detailed mandala pattern. Lightweight and comfortable for all-day wear. A perfect blend of traditional craftsmanship and modern style.',
        price: 45.99,
        category: 'Jewelry',
        stock: 28,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
        rating: 4.9,
        reviewCount: 45,
        metaTitle: 'Silver Mandala Earrings - Handcrafted Hoop Earrings',
        metaDescription: 'Beautiful handmade silver mandala hoop earrings. Intricate artisan design, lightweight & comfortable. Perfect gift for her.',
        keywords: ['mandala earrings', 'silver hoops', 'handmade earrings', 'artisan jewelry', 'boho earrings'],
        featured: true,
    },
    {
        name: 'Braided Leather Brass Bracelet',
        slug: 'braided-leather-brass-bracelet',
        description: 'Rustic artisan leather bracelet with brass beads and secure toggle clasp. Hand-braided genuine leather creates a unique, durable accessory for men and women.',
        price: 35.00,
        category: 'Jewelry',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
        rating: 4.7,
        reviewCount: 32,
        metaTitle: 'Handmade Leather Bracelet with Brass Beads | Artisan Jewelry',
        metaDescription: 'Unique braided leather bracelet with brass accents. Handcrafted unisex design. Durable and stylish artisan jewelry.',
        keywords: ['leather bracelet', 'brass bracelet', 'handmade bracelet', 'unisex jewelry', 'artisan bracelet'],
        featured: false,
    },
    {
        name: 'Rose Gold Moonstone Ring',
        slug: 'rose-gold-moonstone-ring',
        description: 'Delicate handcrafted rose gold ring featuring an ethereal moonstone. The textured band and bezel setting create a romantic, vintage-inspired look.',
        price: 72.50,
        category: 'Jewelry',
        stock: 18,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
        rating: 4.9,
        reviewCount: 58,
        metaTitle: 'Moonstone Rose Gold Ring - Handmade Gemstone Ring',
        metaDescription: 'Elegant handcrafted moonstone ring in rose gold. Unique artisan-made jewelry with natural gemstone. Perfect engagement or promise ring.',
        keywords: ['moonstone ring', 'rose gold ring', 'handmade ring', 'gemstone ring', 'artisan jewelry'],
        featured: true,
    },
    {
        name: 'Bohemian Beaded Tassel Necklace',
        slug: 'bohemian-beaded-tassel-necklace',
        description: 'Vibrant bohemian necklace featuring colorful handmade glass beads and decorative tassel. Perfect statement piece for festival wear and casual outfits.',
        price: 38.00,
        category: 'Jewelry',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
        rating: 4.6,
        reviewCount: 19,
        metaTitle: 'Bohemian Beaded Necklace with Tassel | Handmade Jewelry',
        metaDescription: 'Colorful boho beaded necklace with tassel. Handcrafted glass beads create unique artisan jewelry. Perfect festival accessory.',
        keywords: ['bohemian necklace', 'beaded necklace', 'tassel necklace', 'boho jewelry', 'festival jewelry'],
        featured: false,
    },

    // Home Decor (5 products)
    {
        name: 'Macrame Wall Hanging - Geometric',
        slug: 'macrame-wall-hanging-geometric',
        description: 'Beautiful handmade macrame wall hanging with intricate geometric diamond pattern. Made from 100% natural cotton rope. Adds bohemian charm to any space.',
        price: 65.00,
        category: 'Home Decor',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1555852745-d123f65d4e8e?w=800'],
        rating: 4.8,
        reviewCount: 37,
        metaTitle: 'Handmade Macrame Wall Hanging | Boho Home Decor',
        metaDescription: 'Gorgeous geometric macrame wall art. 100% cotton handcrafted wall hanging. Perfect boho decor for bedroom, living room.',
        keywords: ['macrame wall hanging', 'boho decor', 'wall art', 'handmade decor', 'cotton macrame'],
        featured: true,
    },
    {
        name: 'Handcrafted Ceramic Planter Set',
        slug: 'handcrafted-ceramic-planter-set',
        description: 'Set of artisan ceramic planters with modern geometric patterns. Hand-glazed in terracotta and white. Perfect for succulents, cacti, and small plants.',
        price: 52.00,
        category: 'Home Decor',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'],
        rating: 4.7,
        reviewCount: 28,
        metaTitle: 'Handmade Ceramic Planters | Artisan Pottery',
        metaDescription: 'Beautiful handcrafted ceramic planter set. Modern geometric design, hand-glazed finish. Perfect for indoor plants and succulents.',
        keywords: ['ceramic planters', 'handmade pottery', 'plant pots', 'artisan planters', 'home decor'],
        featured: false,
    },
    {
        name: 'Natural Soy Candle Trio',
        slug: 'natural-soy-candle-trio',
        description: 'Set of three handmade soy candles in elegant glass jars with wooden lids. Scented with essential oils and decorated with dried botanicals. Eco-friendly and long-burning.',
        price: 48.99,
        category: 'Home Decor',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1602874801006-e7d5d0f9c9ef?w=800'],
        rating: 4.9,
        reviewCount: 52,
        metaTitle: 'Handmade Soy Candles Set | Natural Essential Oil Candles',
        metaDescription: 'Eco-friendly handmade soy candle set. Scented with essential oils, features botanical decorations. Clean-burning natural candles.',
        keywords: ['soy candles', 'handmade candles', 'natural candles', 'essential oil candles', 'eco candles'],
        featured: true,
    },
    {
        name: 'Rustic Wood Burnt Wall Art',
        slug: 'rustic-wood-burnt-wall-art',
        description: 'Handcrafted wooden wall art featuring abstract mountain landscape created with pyrography technique. Made from reclaimed wood with natural finish.',
        price: 78.00,
        category: 'Home Decor',
        stock: 8,
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'],
        rating: 4.8,
        reviewCount: 15,
        metaTitle: 'Wood Burnt Wall Art | Handmade Rustic Decor',
        metaDescription: 'Unique handcrafted wood wall art with pyrography mountain design. Reclaimed wood, rustic home decor, artisan made.',
        keywords: ['wood wall art', 'pyrography art', 'rustic decor', 'mountain art', 'handmade wood art'],
        featured: false,
    },
    {
        name: 'Woven Seagrass Storage Basket',
        slug: 'woven-seagrass-storage-basket',
        description: 'Handwoven natural seagrass basket with sturdy handles and geometric pattern. Perfect for storage, organization, or as a decorative planter basket.',
        price: 42.00,
        category: 'Home Decor',
        stock: 22,
        images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800'],
        rating: 4.6,
        reviewCount: 21,
        metaTitle: 'Handwoven Seagrass Basket | Natural Storage Basket',
        metaDescription: 'Beautiful handwoven seagrass storage basket. Natural fiber, sustainable, perfect for home organization and decor.',
        keywords: ['seagrass basket', 'woven basket', 'storage basket', 'natural basket', 'handmade basket'],
        featured: false,
    },

    // Clothing & Accessories (5 products)
    {
        name: 'Hand-Knitted Wool Infinity Scarf',
        slug: 'hand-knitted-wool-infinity-scarf',
        description: 'Cozy infinity scarf hand-knitted from premium merino wool. Soft, warm, and versatile. Available in multiple colors. Perfect for cold weather.',
        price: 56.00,
        category: 'Clothing & Accessories',
        stock: 18,
        images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'],
        rating: 4.9,
        reviewCount: 41,
        metaTitle: 'Hand Knitted Wool Scarf | Handmade Infinity Scarf',
        metaDescription: 'Premium hand-knitted merino wool infinity scarf. Soft, warm, artisan-made. Perfect winter accessory.',
        keywords: ['knitted scarf', 'wool scarf', 'infinity scarf', 'handmade scarf', 'winter accessories'],
        featured: true,
    },
    {
        name: 'Leather Crossbody Messenger Bag',
        slug: 'leather-crossbody-messenger-bag',
        description: 'Handcrafted genuine leather crossbody bag with adjustable strap. Features multiple pockets and vintage brass hardware. Perfect everyday bag.',
        price: 125.00,
        category: 'Clothing & Accessories',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
        rating: 4.8,
        reviewCount: 34,
        metaTitle: 'Handmade Leather Crossbody Bag | Artisan Messenger Bag',
        metaDescription: 'Premium handcrafted leather crossbody bag. Genuine leather, multiple pockets, vintage style. Durable everyday bag.',
        keywords: ['leather bag', 'crossbody bag', 'messenger bag', 'handmade bag', 'leather purse'],
        featured: true,
    },
    {
        name: 'Crochet Boho Wide-Brim Hat',
        slug: 'crochet-boho-wide-brim-hat',
        description: 'Hand-crochet wide-brim sun hat made from natural raffia. Breathable, lightweight, and stylish. Perfect for beach days and summer festivals.',
        price: 44.00,
        category: 'Clothing & Accessories',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=800'],
        rating: 4.7,
        reviewCount: 26,
        metaTitle: 'Hand Crochet Sun Hat | Boho Wide Brim Hat',
        metaDescription: 'Beautiful hand-crochet raffia sun hat. Wide brim, breathable, perfect summer accessory. Handmade boho style.',
        keywords: ['crochet hat', 'sun hat', 'wide brim hat', 'summer hat', 'boho hat'],
        featured: false,
    },
    {
        name: 'Embroidered Cotton Tote Bag',
        slug: 'embroidered-cotton-tote-bag',
        description: 'Eco-friendly cotton tote bag with beautiful hand-embroidered floral design. Sturdy, reusable, and perfect for shopping or daily use.',
        price: 32.00,
        category: 'Clothing & Accessories',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'],
        rating: 4.8,
        reviewCount: 63,
        metaTitle: 'Hand Embroidered Tote Bag | Eco Cotton Shopping Bag',
        metaDescription: 'Beautiful handmade cotton tote with floral embroidery. Eco-friendly, reusable shopping bag. Artisan crafted.',
        keywords: ['tote bag', 'embroidered bag', 'cotton bag', 'reusable bag', 'eco bag'],
        featured: false,
    },
    {
        name: 'Hand-Painted Silk Scarf',
        slug: 'hand-painted-silk-scarf',
        description: 'Luxurious 100% silk scarf with hand-painted abstract watercolor design. Each piece is unique. Lightweight and elegant for any occasion.',
        price: 68.00,
        category: 'Clothing & Accessories',
        stock: 12,
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800'],
        rating: 4.9,
        reviewCount: 29,
        metaTitle: 'Hand Painted Silk Scarf | Unique Artisan Scarf',
        metaDescription: '100% silk hand-painted scarf. Unique watercolor design, luxurious and lightweight. One-of-a-kind artisan accessory.',
        keywords: ['silk scarf', 'hand painted scarf', 'artisan scarf', 'luxury scarf', 'unique scarf'],
        featured: true,
    },

    // Art & Collectibles (3 products)
    {
        name: 'Abstract Acrylic Canvas Painting',
        slug: 'abstract-acrylic-canvas-painting',
        description: 'Original abstract acrylic painting on stretched canvas. Vibrant colors and dynamic brush strokes. Signed by the artist. Ready to hang.',
        price: 185.00,
        category: 'Art & Collectibles',
        stock: 3,
        images: ['https://images.unsplash.com/photo-1561366451-3c5df59be7c0?w=800'],
        rating: 5.0,
        reviewCount: 8,
        metaTitle: 'Original Abstract Painting | Handmade Acrylic Art',
        metaDescription: 'Unique original abstract acrylic painting on canvas. Artist signed, ready to hang. Vibrant contemporary art.',
        keywords: ['abstract painting', 'acrylic art', 'original art', 'canvas painting', 'contemporary art'],
        featured: true,
    },
    {
        name: 'Hand-Carved Wooden Sculpture',
        slug: 'hand-carved-wooden-sculpture',
        description: 'Intricate hand-carved wooden sculpture depicting abstract human form. Made from sustainable hardwood with natural oil finish.',
        price: 215.00,
        category: 'Art & Collectibles',
        stock: 2,
        images: ['https://images.unsplash.com/photo-1578926375605-eaf7559b8461?w=800'],
        rating: 5.0,
        reviewCount: 5,
        metaTitle: 'Hand Carved Wood Sculpture | Artisan Wooden Art',
        metaDescription: 'Exquisite hand-carved wooden sculpture. Sustainable hardwood, abstract design. Unique artisan collectible.',
        keywords: ['wood sculpture', 'hand carved art', 'wooden art', 'artisan sculpture', 'collectible art'],
        featured: false,
    },
    {
        name: 'Watercolor Botanical Print Set',
        slug: 'watercolor-botanical-print-set',
        description: 'Set of 3 original watercolor botanical prints. Museum-quality archival paper. Perfect for creating a gallery wall in any room.',
        price: 95.00,
        category: 'Art & Collectibles',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'],
        rating: 4.8,
        reviewCount: 18,
        metaTitle: 'Watercolor Botanical Prints | Handmade Wall Art Set',
        metaDescription: 'Beautiful set of 3 watercolor botanical prints. Museum quality, archival paper. Perfect art for home decor.',
        keywords: ['watercolor prints', 'botanical art', 'wall art set', 'nature prints', 'handmade prints'],
        featured: false,
    },

    // Bath & Beauty (2 products)
    {
        name: 'Organic Lavender Soap Bar Set',
        slug: 'organic-lavender-soap-bar-set',
        description: 'Set of 3 handmade organic soap bars with lavender and shea butter. Cold-processed, all-natural ingredients. Gentle on sensitive skin.',
        price: 28.00,
        category: 'Bath & Beauty',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1600857062241-98e5dba60f2f?w=800'],
        rating: 4.9,
        reviewCount: 78,
        metaTitle: 'Handmade Lavender Soap | Organic Natural Soap Bar',
        metaDescription: 'Premium handmade lavender soap set. Organic ingredients, cold-processed, gentle on skin. All-natural artisan soap.',
        keywords: ['handmade soap', 'lavender soap', 'organic soap', 'natural soap', 'artisan soap'],
        featured: true,
    },
    {
        name: 'Rose Hip Facial Serum',
        slug: 'rose-hip-facial-serum',
        description: 'Handcrafted organic rose hip facial serum with vitamin C. Anti-aging, moisturizing, and rejuvenating. Made in small batches with pure botanicals.',
        price: 36.00,
        category: 'Bath & Beauty',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'],
        rating: 4.8,
        reviewCount: 42,
        metaTitle: 'Organic Rose Hip Serum | Handmade Facial Serum',
        metaDescription: 'Natural handcrafted rose hip facial serum. Vitamin C, anti-aging, organic ingredients. Small batch artisan skincare.',
        keywords: ['rose hip serum', 'facial serum', 'organic skincare', 'handmade serum', 'natural beauty'],
        featured: false,
    },
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!');

        // Clear existing products (optional - remove if you want to keep existing ones)
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Existing products cleared.');

        // Insert new products
        console.log('Inserting 20 new products...');
        const result = await Product.insertMany(products);
        console.log(`Successfully inserted ${result.length} products!`);

        // Print summary
        console.log('\n=== Product Seeding Summary ===');
        console.log(`Total products added: ${result.length}`);
        console.log('\nProducts by category:');
        const categoryCounts = {};
        result.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} products`);
        });
        console.log('\nFeatured products:', result.filter(p => p.featured).length);
        console.log('================================\n');

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed. Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

// Run the seed function
seedProducts();

const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
    },
    contactInfo: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    appearance: {
        logo: { type: String, default: '' },
        favicon: { type: String, default: '' },
        primaryColor: { type: String, default: '#6366f1' },
        secondaryColor: { type: String, default: '#a855f7' },
        accentColor: { type: String, default: '#f43f5e' },
        heroTitle: { type: String, default: 'Elevate Your Marketplace Experience' },
        heroSubtitle: { type: String, default: 'Discover premium apparel, footwear, cutting-edge electronics, and innovative digital solutions from top creators worldwide.' },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Settings', SettingsSchema);

const express = require('express');
const Settings = require('../models/Settings');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get settings (Public)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update settings (Admin only)
router.put('/', auth, adminAuth, async (req, res) => {
    try {
        const { socialLinks, contactInfo, appearance } = req.body;
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings({ socialLinks, contactInfo, appearance });
        } else {
            settings.socialLinks = socialLinks || settings.socialLinks;
            settings.contactInfo = contactInfo || settings.contactInfo;
            settings.appearance = appearance || settings.appearance;
            settings.updatedAt = Date.now();
        }

        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

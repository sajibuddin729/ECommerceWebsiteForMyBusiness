const express = require('express');
const Page = require('../models/Page');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all pages (Admin only)
router.get('/all', auth, adminAuth, async (req, res) => {
    try {
        const pages = await Page.find().sort({ title: 1 });
        res.json(pages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get page content by slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update page content (Admin only)
router.put('/:slug', auth, adminAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        let page = await Page.findOne({ slug: req.params.slug });

        if (!page) {
            // Create if not exists
            page = new Page({
                title,
                slug: req.params.slug,
                content,
            });
        } else {
            page.title = title || page.title;
            page.content = content || page.content;
            page.lastUpdated = Date.now();
        }

        await page.save();
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

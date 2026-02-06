'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Linkedin, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiCall } from '@/lib/api';
import { Button } from '@/components/ui/button';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Top Rated', href: '/shop?sort=rating' },
      { label: 'Best Price', href: '/shop?sort=price-asc' },
      { label: 'My Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping-info' },
      { label: 'Returns', href: '/returns' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
];

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiCall('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const socialIcons = [
    { Icon: Facebook, url: settings?.socialLinks?.facebook },
    { Icon: Twitter, url: settings?.socialLinks?.twitter },
    { Icon: Instagram, url: settings?.socialLinks?.instagram },
    { Icon: Linkedin, url: settings?.socialLinks?.linkedin },
  ];

  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold mb-4">FusionBytePro</h4>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Elevating your digital experience with premium products, software, and innovative solutions from top creators worldwide.
            </p>
            <div className="flex gap-4">
              {socialIcons.map(({ Icon, url }, i) => (
                url && (
                  <motion.a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, color: '#6366f1' }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
            >
              <h4 className="font-semibold mb-6 text-indigo-400">{section.title}</h4>
              <ul className="space-y-3 text-gray-400">
                {section.links.map((link, j) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5, color: '#fff' }}
                  >
                    <Link href={link.href} className="hover:text-white transition text-sm">
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Strip */}
        {settings?.contactInfo && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-gray-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>{settings.contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>{settings.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{settings.contactInfo.address}</span>
            </div>
          </motion.div>
        )}

        {/* Newsletter */}
        <motion.div
          className="bg-indigo-500/10 rounded-2xl p-8 mb-12 border border-indigo-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl">
            <h4 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-gray-400 mb-6 text-sm">Get real-time updates on new digital assets and exclusive early-bird discounts.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-foreground border border-gray-800 text-white outline-none focus:border-indigo-500 transition-colors"
              />
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
                Join Now
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-xs tracking-wider uppercase">
            &copy; {new Date().getFullYear()} FusionBytePro. A premium digital experience.
          </p>
          <div className="flex gap-8 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


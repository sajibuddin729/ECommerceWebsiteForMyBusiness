'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Linkedin, Phone, MapPin, Send, Sparkles, ArrowRight } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [email, setEmail] = useState('');

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
    { Icon: Facebook, url: settings?.socialLinks?.facebook, color: 'hover:text-blue-500' },
    { Icon: Twitter, url: settings?.socialLinks?.twitter, color: 'hover:text-sky-400' },
    { Icon: Instagram, url: settings?.socialLinks?.instagram, color: 'hover:text-pink-500' },
    { Icon: Linkedin, url: settings?.socialLinks?.linkedin, color: 'hover:text-blue-600' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FusionBytePro
              </span>
            </motion.div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Elevating your shopping experience with premium products and innovative solutions from top creators worldwide.
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, url, color }, i) => (
                url && (
                  <motion.a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${color} transition-all hover:border-primary/50`}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, i) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500" />
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact & Newsletter */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 border-t border-white/10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          {settings?.contactInfo && (
            <motion.div
              className="flex flex-wrap gap-8"
              variants={itemVariants}
            >
              {[
                { icon: Mail, text: settings.contactInfo.email },
                { icon: Phone, text: settings.contactInfo.phone },
                { icon: MapPin, text: settings.contactInfo.address },
              ].map((item, i) => (
                item.text && (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 text-gray-400"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </motion.div>
                )
              ))}
            </motion.div>
          )}

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Subscribe to Newsletter</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Get updates on new products and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-primary/50 transition"
                  whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)' }}
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FusionBytePro. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-400">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <motion.div key={item} whileHover={{ color: '#fff' }}>
                <Link href={`/${item.toLowerCase()}`} className="hover:text-white transition">
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}


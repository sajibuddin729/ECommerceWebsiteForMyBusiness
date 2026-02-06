'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50, rotate: 5 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

import { useAppearance } from './AppearanceProvider';

export default function Hero() {
  const { appearance } = useAppearance();

  return (
    <section className="relative overflow-hidden bg-[#0a0a0b] py-24 md:py-36 min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                The Future of Global Shopping
              </span>
              <h1
                className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {appearance?.heroTitle || 'Elevate Your Marketplace Experience'}
              </h1>
            </motion.div>

            <motion.p className="text-xl text-gray-400 max-w-xl leading-relaxed" variants={itemVariants}>
              {appearance?.heroSubtitle || 'Discover premium apparel, footwear, cutting-edge electronics, and innovative digital solutions from top creators worldwide. Your journey to excellence starts here.'}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-5" variants={itemVariants}>
              <Link href="/shop">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 group">
                  Explore Marketplace
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about-us">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-primary/30 text-primary hover:bg-primary/10 rounded-xl backdrop-blur-sm transition-all duration-300">
                  How it Works
                </Button>
              </Link>
            </motion.div>

            <motion.div className="flex items-center gap-6 pt-4" variants={itemVariants}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0b] bg-gray-800 flex items-center justify-center text-[10px] text-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">Joined by 10k+ creators</p>
                <p className="text-gray-500">Excellence in every byte</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual Showcase */}
          <motion.div
            className="relative hidden md:block"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative z-10 glass-dark rounded-[2.5rem] p-4 p-8 shadow-2xl border-white/5 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
                  alt="FusionBytePro E-commerce Showcase"
                  className="w-full h-full object-cover"
                />

                {/* Floating UI Elements */}
                <motion.div
                  className="absolute top-6 right-6 p-4 glass rounded-2xl shadow-xl border-white/20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold font-mono tracking-wider">TRENDING NOW</p>
                      <p className="text-white/60 text-[10px]">T-shirts & Footwear</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 p-4 glass rounded-2xl shadow-xl border-white/20"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center gap-8">
                      <span className="text-white/60 text-[10px]">GLOBAL SALES</span>
                      <span className="text-primary text-[10px] font-bold">+48%</span>
                    </div>
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Features Minimalist */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 pt-16 border-t border-white/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { label: 'Premium Quality', val: '100%', sub: 'Vetted Assets' },
            { label: 'Fast Delivery', val: 'Instant', sub: 'Global Access' },
            { label: 'Secure Payments', val: 'SSL', sub: 'Encrypted' },
            { label: '24/7 Support', val: 'Live', sub: 'Expert Help' },
          ].map((stat, i) => (
            <motion.div key={i} className="" custom={i} variants={featureVariants}>
              <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-mono">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{stat.val}</span>
                <span className="text-primary text-xs font-medium">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
          <motion.div className="md:col-span-4 mt-8 text-center" custom={4} variants={featureVariants}>
            <p className="text-gray-400 text-sm">&copy; 2024 FusionBytePro. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

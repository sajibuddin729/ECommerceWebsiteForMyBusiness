'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Sparkles, Star, Zap, Shield, Truck, HeartHandshake } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Floating 3D Elements
const FloatingElement = ({ className, delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -15, 0],
      rotateZ: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

import { useAppearance } from './AppearanceProvider';

export default function Hero() {
  const { appearance } = useAppearance();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Animated counter
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev < 10000 ? prev + 100 : 10000));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f] py-24 md:py-36 min-h-[100vh] flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs with Parallax */}
        <motion.div
          className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-primary/40 via-purple-600/30 to-transparent rounded-full blur-[120px]"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-gradient-to-tl from-blue-600/40 via-cyan-500/30 to-transparent rounded-full blur-[120px]"
          style={{ y: y2 }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[40%] h-[40%] bg-gradient-to-bl from-pink-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px]"
          style={{ y: y3 }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating Particles - Fixed positions to avoid hydration mismatch */}
        {[
          { left: 5, top: 10, dur: 4, delay: 0.2 },
          { left: 15, top: 25, dur: 5, delay: 0.5 },
          { left: 25, top: 60, dur: 6, delay: 0.8 },
          { left: 35, top: 40, dur: 4.5, delay: 1.1 },
          { left: 45, top: 80, dur: 5.5, delay: 0.3 },
          { left: 55, top: 15, dur: 7, delay: 0.7 },
          { left: 65, top: 55, dur: 4, delay: 1.0 },
          { left: 75, top: 35, dur: 6, delay: 0.4 },
          { left: 85, top: 70, dur: 5, delay: 0.9 },
          { left: 95, top: 20, dur: 4.5, delay: 0.6 },
          { left: 10, top: 85, dur: 6, delay: 1.2 },
          { left: 30, top: 5, dur: 5.5, delay: 0.1 },
          { left: 50, top: 45, dur: 7, delay: 1.5 },
          { left: 70, top: 90, dur: 4, delay: 0.4 },
          { left: 90, top: 50, dur: 5, delay: 0.8 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.dur,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <motion.span
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/30 text-primary text-sm font-medium backdrop-blur-sm"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}
              >
                <Sparkles className="w-4 h-4" />
                The Future of Shopping
                <motion.span
                  className="ml-1 px-2 py-0.5 bg-primary/30 rounded-full text-xs"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NEW
                </motion.span>
              </motion.span>
            </motion.div>

            {/* Title with 3D Effect */}
            <motion.div variants={itemVariants} className="perspective-1000">
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
              >
                <span className="block">
                  {appearance?.heroTitle?.split(' ').slice(0, 2).join(' ') || 'Elevate Your'}
                </span>
                <span className="block bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {appearance?.heroTitle?.split(' ').slice(2).join(' ') || 'Shopping Experience'}
                </span>
              </motion.h1>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              {appearance?.heroSubtitle || 'Discover premium products, cutting-edge electronics, and innovative solutions from top creators worldwide. Your journey to excellence starts here.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-5" variants={itemVariants}>
              <Link href="/shop">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90 text-white rounded-2xl shadow-2xl shadow-primary/30 group relative overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <span className="relative flex items-center gap-2">
                      Explore Marketplace
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/about-us">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-lg border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 rounded-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 font-semibold">How it Works</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div className="flex items-center gap-6 pt-4" variants={itemVariants}>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-12 rounded-full border-3 border-[#0a0a0f] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm">
                <motion.p
                  className="text-white font-bold text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  {count.toLocaleString()}+ Users
                </motion.p>
                <p className="text-gray-500">Trust our platform</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Visual Showcase */}
          <motion.div
            className="relative hidden md:block perspective-1000"
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Card with 3D Effect */}
            <motion.div
              className="relative z-10 rounded-[2rem] p-2 shadow-2xl border border-white/10 overflow-hidden preserve-3d"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                rotateX,
                rotateY,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient Border Animation */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] opacity-50"
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1)',
                  backgroundSize: '300% 100%',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="relative rounded-[1.5rem] overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
                  alt="E-commerce Showcase"
                  className="w-full aspect-[4/3] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating UI Cards */}
                <FloatingElement className="absolute top-6 right-6" delay={0}>
                  <motion.div
                    className="p-4 rounded-2xl shadow-2xl border border-white/20"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(20px)',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold tracking-wider">TRENDING</p>
                        <p className="text-white/60 text-[10px]">500+ items sold today</p>
                      </div>
                    </div>
                  </motion.div>
                </FloatingElement>

                <FloatingElement className="absolute bottom-6 left-6" delay={1}>
                  <motion.div
                    className="p-4 rounded-2xl shadow-2xl border border-white/20"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(20px)',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-12">
                        <span className="text-white/60 text-[10px] font-medium">SALES TODAY</span>
                        <span className="text-green-400 text-[10px] font-bold">+127%</span>
                      </div>
                      <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: '85%' }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </FloatingElement>

                {/* Stars Rating Floating */}
                <FloatingElement className="absolute bottom-6 right-6" delay={2}>
                  <motion.div
                    className="px-4 py-2 rounded-full shadow-xl border border-white/20 flex items-center gap-2"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-white text-xs font-bold">4.9</span>
                  </motion.div>
                </FloatingElement>
              </div>
            </motion.div>

            {/* Background Decorative 3D Elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-primary/50 to-purple-600/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-blue-600/50 to-cyan-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />

            {/* Floating 3D Shapes */}
            <motion.div
              className="absolute -top-5 left-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 45, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 -right-5 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-xl"
              animate={{
                y: [0, 15, 0],
                x: [0, -10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>

        {/* Features Section with 3D Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32 pt-16 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { icon: Shield, label: 'Premium Quality', val: '100%', sub: 'Verified', color: 'from-emerald-500 to-teal-600' },
            { icon: Truck, label: 'Fast Delivery', val: '24h', sub: 'Express', color: 'from-blue-500 to-cyan-600' },
            { icon: Zap, label: 'Secure Payment', val: 'SSL', sub: 'Protected', color: 'from-purple-500 to-pink-600' },
            { icon: HeartHandshake, label: '24/7 Support', val: 'Live', sub: 'Chat', color: 'from-orange-500 to-red-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="perspective-1000"
              custom={i}
              variants={featureVariants}
            >
              <motion.div
                className="relative p-6 rounded-2xl border border-white/10 overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>

                <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-mono">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <motion.span
                    className="text-3xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                  >
                    {stat.val}
                  </motion.span>
                  <span className="text-primary text-xs font-medium">{stat.sub}</span>
                </div>

                {/* Hover Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

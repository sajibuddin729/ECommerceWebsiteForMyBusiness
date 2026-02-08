'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu, X, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/lib/api';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface UserType {
  name: string;
  email: string;
  isAdmin: boolean;
}

import { useAppearance } from './AppearanceProvider';

import { useRouter } from 'next/navigation';

export default function Header() {
  const { appearance } = useAppearance();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 0 0 rgba(0,0,0,0)', '0 10px 40px rgba(99, 102, 241, 0.1)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const fetchUser = async () => {
    try {
      const data = await apiCall('/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const navItems = ['Home', 'Shop', 'About', 'Contact'];

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        boxShadow: headerShadow,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {appearance?.logo ? (
                <img src={appearance.logo} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <motion.div className="relative">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    FusionBytePro
                  </span>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                  />
                </motion.div>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item === 'Home' ? '/' : (item === 'About' ? '/about-us' : `/${item.toLowerCase()}`)}
                >
                  <motion.div
                    className={`relative px-4 py-2 rounded-xl font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-600 hover:text-primary'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 -z-10"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <motion.div
                className={`flex items-center rounded-full px-4 py-2.5 transition-all duration-300 ${scrolled ? 'bg-gray-100' : 'bg-white/80 backdrop-blur-sm border border-gray-200'
                  }`}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)' }}
                whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)' }}
              >
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent ml-2 outline-none text-sm w-36 focus:w-48 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </form>

            {/* Mobile Search Toggle */}
            <motion.button
              className="sm:hidden p-2.5 hover:bg-gray-100 rounded-xl transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.div
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-pink-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                />
              </motion.div>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <motion.div
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <motion.button
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.div
                  className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-gray-100">
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link href="/profile">
                      <motion.div
                        className="px-4 py-2.5 hover:bg-gray-50 rounded-xl transition flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        My Profile
                      </motion.div>
                    </Link>
                    <Link href="/orders">
                      <motion.div
                        className="px-4 py-2.5 hover:bg-gray-50 rounded-xl transition flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        My Orders
                      </motion.div>
                    </Link>
                    {user.isAdmin && (
                      <Link href="/admin">
                        <motion.div
                          className="px-4 py-2.5 hover:bg-primary/10 rounded-xl transition flex items-center gap-2 text-primary font-semibold"
                          whileHover={{ x: 5 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Admin Dashboard
                        </motion.div>
                      </Link>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <motion.button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-xl text-red-600 transition flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <Link href="/auth/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary/20 px-5"
                  >
                    Login
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="sm:hidden pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-2xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent w-full outline-none"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              className="md:hidden pt-4 pb-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-2 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className="px-4 py-3 hover:bg-gray-50 rounded-xl transition font-medium"
                        whileHover={{ x: 5 }}
                      >
                        {item}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

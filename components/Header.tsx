'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {appearance?.logo ? (
                <img src={appearance.logo} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-bold text-gradient">
                  FusionBytePro
                </span>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Shop', 'About', 'Contact'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item === 'Home' ? '/' : (item === 'About' ? '/about-us' : `/${item.toLowerCase()}`)}
                  className="text-foreground hover:text-primary transition"
                >
                  <motion.span whileHover={{ scale: 1.1 }}>
                    {item}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <motion.div
                className="flex items-center bg-muted rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent ml-2 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </form>

            <motion.button
              className="sm:hidden p-2 hover:bg-muted rounded-full transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-6 h-6" />
            </motion.button>

            <Link href="/wishlist">
              <motion.div
                className="relative p-2 hover:bg-muted rounded-full transition"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-6 h-6" />
              </motion.div>
            </Link>

            <Link href="/cart">
              <motion.div
                className="relative p-2 hover:bg-muted rounded-full transition"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {user ? (
              <div className="relative group">
                <motion.button
                  className="p-2 hover:bg-muted rounded-full transition"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-6 h-6" />
                </motion.button>
                <motion.div
                  className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-muted">My Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-muted">My Orders</Link>
                  {user.isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 hover:bg-muted text-primary font-semibold">Admin Dashboard</Link>
                  )}
                  <motion.button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-muted text-destructive"
                    whileHover={{ paddingLeft: '1rem' }}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <Link href="/auth/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="sm:hidden pb-4 px-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch} className="flex items-center bg-muted rounded-xl px-4 py-2">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent w-full outline-none text-sm"
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
              className="md:hidden pb-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {['Home', 'Shop', 'About', 'Contact'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block px-4 py-2 hover:bg-muted rounded">
                    {item}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

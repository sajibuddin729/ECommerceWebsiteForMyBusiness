'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to checkout');
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <motion.div
          className="max-w-7xl mx-auto px-4 py-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Empty Cart Animation */}
          <motion.div
            className="relative inline-block mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0.3)', '0 0 0 30px rgba(99, 102, 241, 0)', '0 0 0 0 rgba(99, 102, 241, 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag className="w-16 h-16 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your Cart is Empty
          </motion.h1>
          <motion.p
            className="text-gray-500 text-lg mb-10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Looks like you haven't added anything to your cart yet. Start exploring our amazing products!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/shop">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-8 py-6 text-lg rounded-2xl shadow-xl shadow-primary/30 group">
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2">{cartItems.length} items in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.productId}
                  className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden group"
                  variants={itemVariants}
                  exit="exit"
                  layout
                  whileHover={{
                    boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.15)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Gradient on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                  />

                  <div className="flex gap-6">
                    {/* Image with 3D Effect */}
                    <motion.div
                      className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <motion.h3
                          className="font-bold text-lg text-gray-800 mb-1 group-hover:text-primary transition-colors"
                        >
                          {item.name}
                        </motion.h3>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                          <motion.button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-3 hover:bg-gray-200 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <motion.span
                            className="px-5 font-bold text-lg"
                            key={item.quantity}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-3 hover:bg-gray-200 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <motion.button
                          onClick={() => removeItem(item.productId)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-400">Subtotal</p>
                      <motion.p
                        className="text-2xl font-bold text-gray-800"
                        key={item.price * item.quantity}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24 overflow-hidden"
              whileHover={{ boxShadow: '0 30px 60px -15px rgba(99, 102, 241, 0.2)' }}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -z-10" />

              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-8">
                <span>Total</span>
                <motion.span
                  className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                  key={calculateTotal()}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  ₹{calculateTotal().toLocaleString()}
                </motion.span>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white py-6 text-lg rounded-2xl shadow-lg shadow-primary/30 relative overflow-hidden group"
                  disabled={loading}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full mt-4 py-6 rounded-2xl border-2"
                  onClick={() => router.push('/shop')}
                >
                  Continue Shopping
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-4">Why shop with us?</p>
                {[
                  { icon: Shield, text: 'Secure Checkout' },
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: CreditCard, text: 'Cash on Delivery' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-500"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

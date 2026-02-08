'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// 3D Card Component
function WishlistCard({ item, onRemove, onAddToCart }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        className="relative preserve-3d"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        variants={itemVariants}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-blue-500/30 rounded-2xl blur-xl"
          animate={{ opacity: isHovered ? 0.6 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />

        <Link href={`/product/${item.productId._id}`}>
          <motion.div
            className="relative bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col border border-gray-100"
            whileHover={{ boxShadow: '0 30px 60px -15px rgba(236, 72, 153, 0.3)' }}
            style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)' }}
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-10"
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.8 }}
              />

              <motion.img
                src={item.productId.images?.[0] || 'https://via.placeholder.com/400'}
                alt={item.productId.name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Remove Button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(item.productId._id);
                }}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-red-500 flex items-center justify-center shadow-xl hover:bg-red-500 hover:text-white transition z-20"
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>

              {/* Heart Badge */}
              <motion.div
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Heart className="w-3 h-3 fill-white" />
                Saved
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              className="p-5 flex-1 flex flex-col"
              style={{ transform: 'translateZ(10px)' }}
            >
              <motion.h3
                className="font-bold text-gray-800 line-clamp-2 mb-3 text-lg"
                animate={{ color: isHovered ? '#ec4899' : '#1f2937' }}
              >
                {item.productId.name}
              </motion.h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(item.productId.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({item.productId.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  ₹{item.productId.price.toLocaleString()}
                </span>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(item);
                }}
                className="mt-auto w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                />
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchWishlist();
  }, [router]);

  const fetchWishlist = async () => {
    try {
      const data = await apiCall('/wishlist');
      setWishlistItems(data.products || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await apiCall(`/wishlist/${productId}`, { method: 'DELETE' });
      setWishlistItems(wishlistItems.filter((p: any) => p.productId._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: any) => cartItem.productId === item.productId._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0],
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-sm font-medium text-pink-600">Your Favorites</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            {wishlistItems.length} items saved for later
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center py-24 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
              className="relative inline-block mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-pink-400" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding products you love and they'll appear here
            </p>
            <Link href="/shop">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-xl shadow-pink-500/30 group">
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <WishlistCard
                  key={item._id}
                  item={item}
                  onRemove={removeFromWishlist}
                  onAddToCart={addToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}

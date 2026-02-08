'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { apiCall } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to add to wishlist');
        return;
      }

      if (isWishlisted) {
        await apiCall(`/wishlist/${product._id}`, { method: 'DELETE' });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await apiCall('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId: product._id }),
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product._id}`);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        className="relative preserve-3d"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Glow Effect Behind Card */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-blue-500/30 rounded-2xl blur-xl"
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        <Link href={`/product/${product._id}`}>
          <motion.div
            className="relative bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col border border-gray-100"
            style={{
              transformStyle: 'preserve-3d',
              transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
            }}
            whileHover={{
              boxShadow: '0 30px 60px -15px rgba(99, 102, 241, 0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
              {/* Shimmer overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-10"
                initial={{ x: '-100%' }}
                animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />

              <motion.img
                src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Floating Category Badge */}
              <motion.div
                className="absolute top-4 left-4"
                style={{ transform: 'translateZ(40px)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {product.category}
                </span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="absolute top-4 right-4 space-y-2"
                style={{ transform: 'translateZ(50px)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={handleWishlist}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition ${isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
                    }`}
                  disabled={loading}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  onClick={handleQuickView}
                  className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition"
                  whileHover={{ scale: 1.15, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Price Badge (Floating) */}
              <motion.div
                className="absolute bottom-4 right-4"
                style={{ transform: 'translateZ(60px)' }}
                animate={{
                  y: isHovered ? -5 : 0,
                }}
              >
                <motion.div
                  className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-xl shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              className="p-5 flex-1 flex flex-col"
              style={{ transform: 'translateZ(10px)' }}
            >
              <motion.h3
                className="font-bold text-gray-800 line-clamp-2 mb-3 text-lg"
                animate={{
                  color: isHovered ? '#6366f1' : '#1f2937',
                }}
                transition={{ duration: 0.3 }}
              >
                {product.name}
              </motion.h3>

              {/* Rating with Animation */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star
                        className={`w-4 h-4 ${i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                          }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">({product.reviewCount})</span>
              </div>

              {/* Add to Cart Button with 3D Effect */}
              <motion.button
                onClick={handleAddToCart}
                className="mt-auto w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 rounded-xl transition flex items-center justify-center gap-2 font-bold shadow-lg relative overflow-hidden group"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Shine Effect */}
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

            {/* 3D Border Gradient */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: isHovered
                  ? 'inset 0 0 0 2px rgba(99, 102, 241, 0.5)'
                  : 'inset 0 0 0 0px rgba(99, 102, 241, 0)',
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

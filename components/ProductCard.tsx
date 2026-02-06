'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { apiCall } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
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

  const handleWishlist = async () => {
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

  return (
    <Link href={`/product/${product._id}`}>
      <motion.div
        className="bg-card rounded-[--radius] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer h-full flex flex-col border border-border/50 hover:border-primary/20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted aspect-square">
          <motion.img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
          />

          {/* Action Buttons */}
          <motion.div
            className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                handleWishlist();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isWishlisted
                  ? 'bg-destructive text-white'
                  : 'bg-white text-foreground hover:bg-primary hover:text-white'
                }`}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </motion.div>
            </motion.button>
          </motion.div>

          <div className="absolute top-4 left-4">
            <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating)
                      ? 'fill-secondary text-secondary'
                      : 'fill-muted text-muted'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}

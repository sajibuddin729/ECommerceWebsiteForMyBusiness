'use client';

import React, { useRef } from "react"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Image Effect
  const imageRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiCall(`/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews);

      const token = localStorage.getItem('token');
      if (token) {
        checkWishlist();
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const data = await apiCall(`/wishlist/check/${id}`);
      setIsWishlisted(data.inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist');
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: id,
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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await apiCall(`/wishlist/${id}`, { method: 'DELETE' });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await apiCall('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId: id }),
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to review');
      return;
    }

    setSubmittingReview(true);
    try {
      await apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: id, rating, comment }),
      });

      toast.success('Review added successfully');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-1/4 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-16 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />
        <motion.div
          className="max-w-7xl mx-auto px-4 py-24 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product not found</h1>
          <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
        </motion.div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Image Gallery with 3D Effect */}
          <motion.div variants={itemVariants}>
            <div className="perspective-1000">
              <motion.div
                ref={imageRef}
                className="relative rounded-3xl overflow-hidden shadow-2xl bg-white"
                style={{
                  rotateX: isHovered ? rotateX : 0,
                  rotateY: isHovered ? rotateY : 0,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ boxShadow: '0 40px 80px -20px rgba(99, 102, 241, 0.3)' }}
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 opacity-0"
                  animate={{ opacity: isHovered ? 1 : 0 }}
                />

                {/* Main Image */}
                <motion.div
                  className="aspect-square"
                  animate={{ scale: isHovered ? 1.02 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </motion.div>

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                      onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}

                {/* Image Indicator Dots */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_: any, i: number) => (
                      <motion.button
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImage === i ? 'bg-primary w-8' : 'bg-white/60'
                          }`}
                        onClick={() => setSelectedImage(i)}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <motion.div
                className="mt-6 flex gap-4 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.images.map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? 'border-primary shadow-lg shadow-primary/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    onClick={() => setSelectedImage(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div className="space-y-8" variants={containerVariants}>
            {/* Category & Title */}
            <motion.div variants={itemVariants}>
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4" />
                {product.category}
              </motion.span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                {product.name}
              </h1>
            </motion.div>

            {/* Rating */}
            <motion.div className="flex items-center gap-4" variants={itemVariants}>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star
                      className={`w-6 h-6 ${i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-lg font-bold text-gray-800">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500">({product.reviewCount} reviews)</span>
            </motion.div>

            {/* Description */}
            <motion.p className="text-gray-600 text-lg leading-relaxed" variants={itemVariants}>
              {product.description}
            </motion.p>

            {/* Price Card */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 overflow-hidden"
              variants={itemVariants}
              whileHover={{ boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.15)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10" />

              <div className="flex items-center justify-between mb-4">
                <motion.span
                  className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  ₹{product.price.toLocaleString()}
                </motion.span>
              </div>

              <div className={`flex items-center gap-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <motion.div
                  className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-medium">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex gap-4" variants={itemVariants}>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white py-7 text-lg rounded-2xl shadow-xl shadow-primary/30 relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className={`py-7 px-6 rounded-2xl border-2 transition-all ${isWishlisted
                    ? 'bg-pink-50 border-pink-500 text-pink-500'
                    : 'border-gray-200 hover:border-pink-500 hover:text-pink-500'
                    }`}
                >
                  <Heart
                    className="w-6 h-6"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'Orders above ₹499' },
                { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy' },
                { icon: Shield, title: 'Secure', desc: 'COD available' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-gray-100 text-center hover:shadow-lg hover:border-primary/20 transition-all"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <p className="font-bold text-gray-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
              {reviews.length} reviews
            </span>
          </div>

          {/* Add Review Form */}
          {typeof window !== 'undefined' && localStorage.getItem('token') && (
            <motion.div
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <motion.button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className="focus:outline-none"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className={`w-10 h-10 transition ${r <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition resize-none"
                    rows={5}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-6 rounded-2xl shadow-lg"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Reviews List */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                  variants={itemVariants}
                  whileHover={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {(review.userId?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{review.userId?.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-16 bg-white rounded-3xl border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-5xl mb-4">💭</div>
                <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

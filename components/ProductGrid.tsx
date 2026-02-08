'use client';

import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Grid3X3, LayoutGrid, Filter } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
}

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  loading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ProductGrid({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  loading,
}: ProductGridProps) {
  // Group products by category when "All" is selected
  const groupedProducts = categories
    .filter((cat) => cat !== 'All')
    .map((cat) => ({
      name: cat,
      items: products.filter((p) => p.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  const renderProductSection = (title: string, items: Product[], showHeader = true) => (
    <motion.div
      key={title}
      className="mb-20 last:mb-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {showHeader && (
        <motion.div
          className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-gray-100"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Collection</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">{title}</h2>
            <p className="text-gray-500 mt-2">
              Explore our curated selection of premium {title.toLowerCase()}
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm font-bold text-white bg-gradient-to-r from-primary to-purple-600 px-4 py-2 rounded-full shadow-lg">
              {items.length} Products
            </span>
          </motion.div>
        </motion.div>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {items.map((product, i) => (
          <motion.div
            key={product._id}
            variants={itemVariants}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <div id="products" className="scroll-mt-20">
      {/* Category Filter with 3D Effects */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Browse Categories</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
            Curated Collections
          </h2>
          <motion.div
            className="h-1.5 w-24 bg-gradient-to-r from-primary via-purple-500 to-pink-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Discover products tailored to your style and needs
          </p>
        </div>

        {/* Category Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, i) => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden ${selectedCategory === category
                ? 'bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-xl shadow-primary/30'
                : 'bg-white text-gray-700 border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg'
                }`}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine Effect */}
              {selectedCategory === category && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Products Display */}
      {loading ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="space-y-4"
              variants={itemVariants}
            >
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="w-full h-5 rounded-lg" />
              <Skeleton className="w-3/4 h-4 rounded-lg" />
              <Skeleton className="w-1/2 h-8 rounded-lg" />
            </motion.div>
          ))}
        </motion.div>
      ) : products.length > 0 ? (
        selectedCategory === 'All' ? (
          groupedProducts.map((group) => renderProductSection(group.name, group.items))
        ) : (
          renderProductSection(selectedCategory, products, true)
        )
      ) : (
        <motion.div
          className="text-center py-24 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl -z-10" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />

          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">We couldn't find any products in "{selectedCategory}"</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onCategoryChange('All')}
              className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl px-6 py-3 shadow-lg shadow-primary/20"
            >
              View All Products
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

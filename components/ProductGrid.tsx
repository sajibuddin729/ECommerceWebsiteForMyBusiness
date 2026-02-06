'use client';

import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
    <div key={title} className="mb-16 last:mb-0">
      {showHeader && (
        <motion.div
          className="mb-8 flex items-end justify-between border-b pb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground capitalize">{title}</h2>
            <p className="text-muted-foreground mt-1">
              Discover premium {title.toLowerCase()} for your digital workflow
            </p>
          </div>
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {items.length} Items
          </span>
        </motion.div>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              delay: (i % 4) * 0.1,
              duration: 0.4,
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div id="products" className="scroll-mt-20">
      {/* Category Filter */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Curated Collections</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, i) => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-8 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm ${selectedCategory === category
                ? 'bg-primary text-white scale-105 shadow-md shadow-primary/20'
                : 'bg-white text-foreground border border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Products Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        selectedCategory === 'All' ? (
          groupedProducts.map((group) => renderProductSection(group.name, group.items))
        ) : (
          renderProductSection(selectedCategory, products, true)
        )
      ) : (
        <motion.div
          className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-xl text-muted-foreground">No products found in "{selectedCategory}"</p>
          <Button
            variant="link"
            onClick={() => onCategoryChange('All')}
            className="mt-2 text-primary"
          >
            Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}

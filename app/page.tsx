'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { apiCall } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
      const data = await apiCall(`/products${query}`);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiCall('/products/categories/all');
      setCategories(['All', ...(data.categories || [])]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(['All']);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ProductGrid 
          products={products} 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loading}
        />
      </div>
      <Footer />
      <Toaster />
    </main>
  );
}

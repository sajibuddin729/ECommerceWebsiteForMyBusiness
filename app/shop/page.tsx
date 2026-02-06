'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiCall } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

function ShopContent() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [search, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let queryParams = [];
            if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
            if (selectedCategory !== 'All') queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const data = await apiCall(`/products${queryString}`);
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
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="mb-8">
                    {search && (
                        <h1 className="text-3xl font-bold mb-4 italic">
                            Search results for "{search}"
                        </h1>
                    )}
                </div>
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

export default function ShopPage() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}

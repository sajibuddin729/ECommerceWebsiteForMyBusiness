'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiCall } from '@/lib/api';
import { motion } from 'framer-motion';

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchPage();
        }
    }, [slug]);

    const fetchPage = async () => {
        try {
            const data = await apiCall(`/pages/${slug}`);
            setPage(data);
        } catch (error) {
            console.error('Failed to fetch page:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!page) {
        return (
            <main className="min-h-screen">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                    <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <motion.article
                className="max-w-4xl mx-auto px-4 py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">{page.title}</h1>
                <div
                    className="prose prose-lg max-w-none prose-headings:text-gradient prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </motion.article>
            <Footer />
        </main>
    );
}

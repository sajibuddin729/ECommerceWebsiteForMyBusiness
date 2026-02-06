'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await apiCall('/pages/contact');
                setPageData(data);
            } catch (error) {
                console.error('Error fetching contact page:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
            </div>
        );
    }

    if (!pageData) {
        return <div className="text-center py-20">Page not found.</div>;
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto py-20 px-4 prose prose-orange lg:prose-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold mb-8">{pageData.title}</h1>
            <div
                className="text-lg text-muted-foreground space-y-6"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
        </motion.div>
    );
}

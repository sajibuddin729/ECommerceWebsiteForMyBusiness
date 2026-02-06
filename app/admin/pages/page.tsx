'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function AdminPagesListPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const data = await apiCall('/pages/all');
            setPages(data);
        } catch (error) {
            toast.error('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Content Pages</h1>
                    <p className="text-muted-foreground transition-colors group-hover:text-foreground">Manage dynamic content for your store info pages.</p>
                </div>
            </div>

            {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading pages...</div>
            ) : (
                <div className="grid gap-4">
                    {pages.map((page, i) => (
                        <motion.div
                            key={page._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-4 rounded-xl border border-border flex items-center justify-between hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{page.title}</h3>
                                    <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">/{page.slug}</p>
                                </div>
                            </div>
                            <Link href={`/admin/pages/${page.slug}`}>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Page
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

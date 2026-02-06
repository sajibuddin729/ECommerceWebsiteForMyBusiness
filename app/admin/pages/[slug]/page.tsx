'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function AdminPageEditor() {
    const { slug } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState({
        title: '',
        content: '',
        slug: ''
    });

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
            toast.error('Failed to load page content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiCall(`/pages/${slug}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: page.title,
                    content: page.content
                })
            });
            toast.success('Page updated successfully!');
            router.push('/admin/pages');
        } catch (error) {
            toast.error('Failed to update page');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading editor...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.push('/admin/pages')} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pages
                </Button>
                <div className="flex gap-2">
                    <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 text-foreground bg-transparent transition-colors hover:bg-muted">
                            <Eye className="w-4 h-4" />
                            Preview
                        </Button>
                    </a>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border shadow-sm space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                        id="title"
                        value={page.title}
                        onChange={(e) => setPage({ ...page, title: e.target.value })}
                        className="text-lg font-semibold"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML Supported)</Label>
                    <textarea
                        id="content"
                        value={page.content}
                        onChange={(e) => setPage({ ...page, content: e.target.value })}
                        className="w-full min-h-[400px] p-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm leading-relaxed"
                    />
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border border-dashed">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Slug: <strong>/{page.slug}</strong> (You cannot change the slug from the editor)
                </p>
            </div>
        </div>
    );
}

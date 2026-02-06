'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNav from '@/components/admin/AdminNav';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.isAdmin) {
            router.push('/');
            return;
        }
        setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center">Verifying admin access...</div>;
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <AdminNav />
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
            <Toaster />
        </main>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrders from '@/components/admin/RecentOrders';
import { apiCall } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.isAdmin) {
      router.push('/');
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const data = await apiCall('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({ orders: 0, users: 0, products: 0, revenue: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your store and orders</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <>
          <DashboardStats stats={stats} />
          <RecentOrders />
        </>
      )}
    </>
  );
}

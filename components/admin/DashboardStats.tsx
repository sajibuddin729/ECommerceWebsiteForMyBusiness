'use client';

import { ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

interface Stats {
  orders: number;
  users: number;
  products: number;
  revenue: number;
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, FileText } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'Manage Pages', href: '/admin/pages' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white border-r border-border sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

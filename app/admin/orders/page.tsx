'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    Truck,
    Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Order {
    _id: string;
    userId: {
        name: string;
        email: string;
    };
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await apiCall('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        try {
            await apiCall(`/admin/orders/${orderId}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'shipped': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-muted-foreground bg-muted border-border';
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Order Management</h1>
                    <p className="text-muted-foreground">Track and manage marketplace transactions.</p>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Order ID or Customer..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Order Details</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-muted rounded w-24"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-muted/30 transition group"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-sm group-hover:text-primary transition">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{order.userId?.name || 'Guest'}</p>
                                            <p className="text-xs text-muted-foreground">{order.userId?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            ₹{order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                {order.status === 'Confirmed' && <Clock className="w-3 h-3" />}
                                                {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                                                {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'Confirmed')}>
                                                            Mark as Confirmed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'Shipped')}>
                                                            Mark as Shipped
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order._id, 'Delivered')}>
                                                            Mark as Delivered
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

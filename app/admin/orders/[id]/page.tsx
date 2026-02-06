'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiCall } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OrderDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            // In this setup, we might not have a specific 'get single order' admin route yet.
            // Let's check admin routes or use a general order route.
            // Based on server/routes/admin.js, there isn't a GET /orders/:id yet. 
            // I should probably add it or use a workaround.
            // For now, let's try to fetch all and filter, or I'll add the route.
            const data = await apiCall('/admin/orders');
            const foundOrder = data.find((o: any) => o._id === id);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                toast.error('Order not found');
                router.push('/admin/orders');
            }
        } catch (error) {
            toast.error('Failed to load order details');
            router.push('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center">Loading order details...</div>;
    if (!order) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold font-heading">Order #{order._id.slice(-8).toUpperCase()}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Order Items
                        </h3>
                        <div className="divide-y divide-border">
                            {order.items.map((item: any, index: number) => (
                                <div key={index} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                            <Package className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.productId?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold">₹{(item.quantity * item.price).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-xl font-bold">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Customer & Shipping */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                            <User className="w-5 h-5 text-primary" />
                            Customer Details
                        </h3>
                        <div className="space-y-2">
                            <p className="font-bold">{order.userId?.name || 'Guest User'}</p>
                            <p className="text-sm text-muted-foreground">{order.userId?.email || 'No email provided'}</p>
                            <p className="text-sm text-muted-foreground">{order.userId?.phone || 'No phone provided'}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            Shipping Address
                        </h3>
                        <div className="text-sm space-y-1">
                            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                            <p>{order.shippingAddress?.country}</p>
                            <p className="mt-2 text-muted-foreground font-medium">Phone: {order.shippingAddress?.phoneNumber}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Payment & Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Method:</span>
                                <span className="font-semibold">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-semibold">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

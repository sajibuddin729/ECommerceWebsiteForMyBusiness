'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { apiCall } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);

    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || '',
        phoneNumber: userData.phone || '',
      }));
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await apiCall('/auth/me');
      setUser(data);
      if (data.address) {
        setFormData((prev) => ({
          ...prev,
          street: data.address.street || '',
          city: data.address.city || '',
          state: data.address.state || '',
          pincode: data.address.pincode || '',
          country: data.address.country || 'India',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const total = calculateTotal();
  const finalTotal = total;

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.street || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items,
          shippingAddress: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
          },
        }),
      });

      localStorage.removeItem('cart');
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <Button onClick={() => router.push('/')} className="bg-primary">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {step === 3 ? (
          // Order Confirmation
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your order. Your items will be delivered soon.
            </p>

            <div className="bg-white rounded-xl p-8 border border-border mb-8">
              <h2 className="text-xl font-semibold mb-6">Order Details</h2>
              <div className="space-y-4 text-left">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-xl text-primary">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <p className="text-yellow-800">
                <strong>Payment Method:</strong> Cash on Delivery (COD)<br />
                <span className="text-sm">You will pay ₹{finalTotal.toLocaleString()} when your package arrives</span>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push('/orders')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {!user && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Already have an account?</h3>
                    <p className="text-sm text-muted-foreground">Log in for a faster checkout and easy order tracking.</p>
                  </div>
                  <Button
                    onClick={() => router.push('/auth/login?redirect=/checkout')}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    Login Now
                  </Button>
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-12">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                  <span className="font-medium">Shipping Address</span>
                </div>
                <div className="flex-1 h-1 mx-4" style={{ backgroundColor: step >= 2 ? 'var(--color-primary)' : '#e5e7eb' }} />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'border-2 border-muted'}`}>2</div>
                  <span className="font-medium">Review Order</span>
                </div>
              </div>

              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="bg-white rounded-xl p-8 border border-border space-y-6">
                  <h2 className="text-2xl font-bold">Shipping Address</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                  >
                    Review Order
                  </Button>
                </div>
              )}

              {/* Step 2: Review Order */}
              {step === 2 && (
                <div className="bg-white rounded-xl p-8 border border-border space-y-6">
                  <h2 className="text-2xl font-bold">Review Order</h2>

                  {/* Address Summary */}
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                    <p className="text-sm">{formData.fullName}</p>
                    <p className="text-sm">{formData.street}</p>
                    <p className="text-sm">{formData.city}, {formData.state} {formData.pincode}</p>
                    <p className="text-sm">{formData.country}</p>
                    <p className="text-sm mt-2">Phone: {formData.phoneNumber}</p>
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="mt-4 text-sm"
                    >
                      Edit Address
                    </Button>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2 text-blue-900">Payment Method</h3>
                    <p className="text-blue-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-blue-800 mt-2">
                      You will pay ₹{finalTotal.toLocaleString()} when your package arrives
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {step < 3 && (
              <div>
                <div className="bg-white rounded-xl p-6 border border-border sticky top-24 space-y-6">
                  <h2 className="text-2xl font-bold">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-border pt-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t border-border pt-3">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

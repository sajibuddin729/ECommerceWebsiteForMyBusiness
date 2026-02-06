'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchWishlist();
  }, [router]);

  const fetchWishlist = async () => {
    try {
      const data = await apiCall('/wishlist');
      setWishlistItems(data.products || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await apiCall(`/wishlist/${productId}`, {
        method: 'DELETE',
      });
      setWishlistItems(wishlistItems.filter((p: any) => p.productId._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: any) => cartItem.productId === item.productId._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0],
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">Your favorite items saved for later</p>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-8">Your wishlist is empty</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Link key={item._id} href={`/product/${item.productId._id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-muted aspect-square">
                    <img
                      src={item.productId.images?.[0] || 'https://via.placeholder.com/400'}
                      alt={item.productId.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.productId._id);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition">
                      {item.productId.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(item.productId.rating)
                              ? 'text-secondary fill-secondary'
                              : 'text-muted fill-muted'
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({item.productId.reviewCount})</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-primary">
                        ₹{item.productId.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(item);
                      }}
                      className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

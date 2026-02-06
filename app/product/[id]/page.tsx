'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiCall(`/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews);

      // Check if wishlisted
      const token = localStorage.getItem('token');
      if (token) {
        checkWishlist();
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const data = await apiCall(`/wishlist/check/${id}`);
      setIsWishlisted(data.inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist');
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await apiCall(`/wishlist/${id}`, {
          method: 'DELETE',
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await apiCall('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId: id }),
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to review');
      return;
    }

    setSubmittingReview(true);
    try {
      await apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: id, rating, comment }),
      });

      toast.success('Review added successfully');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmittingReview(false);
    }
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

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">Product not found</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg aspect-square">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images?.slice(1).map((img: string, idx: number) => (
                <div key={idx} className="bg-white rounded-lg overflow-hidden cursor-pointer">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`View ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating)
                      ? 'fill-secondary text-secondary'
                      : 'fill-muted text-muted'
                      }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-muted p-6 rounded-xl space-y-4">
              <p className="text-5xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
              <p className="text-muted-foreground">
                Stock: <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                className="flex-1 border-2 bg-transparent"
              >
                <Heart
                  className="w-5 h-5"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  color={isWishlisted ? 'rgb(220, 38, 38)' : 'currentColor'}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-2 p-4 border border-border rounded-lg">
              <p className="text-sm"><strong>Free Shipping:</strong> On all orders above ₹499</p>
              <p className="text-sm"><strong>Easy Returns:</strong> 30-day return policy</p>
              <p className="text-sm"><strong>Secure Payment:</strong> Cash on Delivery available</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>

          {/* Add Review Form */}
          {localStorage.getItem('token') && (
            <div className="bg-white rounded-xl p-8 border border-border space-y-6">
              <h3 className="text-xl font-semibold">Share Your Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition ${r <= rating
                            ? 'fill-secondary text-secondary'
                            : 'fill-muted text-muted'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-xl p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                ? 'fill-secondary text-secondary'
                                : 'fill-muted text-muted'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-foreground">{review.comment}</p>}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

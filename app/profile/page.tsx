'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUser();
  }, [router]);

  const fetchUser = async () => {
    try {
      const data = await apiCall('/auth/me');
      setUser(data);
      setFormData(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      setUser(updated);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
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

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          {!editing ? (
            <>
              {/* Profile Info */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-xl font-semibold mt-2">{user?.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg mt-2">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg mt-2">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>

                {user?.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-lg mt-2">
                      {user.address.street}<br />
                      {user.address.city}, {user.address.state} {user.address.pincode}<br />
                      {user.address.country}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-lg mt-2">
                    <span className={`px-3 py-1 rounded-full ${user?.isAdmin ? 'bg-primary text-white' : 'bg-muted'}`}>
                      {user?.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-lg mt-2">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => setEditing(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border"
                />
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold">Address</h3>
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-border"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-border"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={formData.address?.pincode || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, pincode: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-border"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.address?.country || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-border"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditing(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

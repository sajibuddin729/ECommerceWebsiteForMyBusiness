'use client';

import React from "react"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, Plus, Upload } from 'lucide-react';
import { apiCall } from '@/lib/api';

interface ProductFormProps {
  productId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

export default function ProductForm({ productId, initialData, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Handmade',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    images: initialData?.images || [],
  });

  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Handmade', 'Home Decor', 'Fashion', 'Jewelry', 'Art', 'Electronics', 'Books', 'Gifts'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleAddImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) {
      toast.error('Please enter an image URL');
      return;
    }

    const updatedImages = [...imageUrls, trimmedUrl];
    setImageUrls(updatedImages);
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
    }));
    setNewImageUrl('');
    toast.success('Image added');
  };

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedImages = [...imageUrls, base64String];
      setImageUrls(updatedImages);
      setFormData(prev => ({
        ...prev,
        images: updatedImages,
      }));
      toast.success('Image uploaded from device');
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.stock || imageUrls.length === 0) {
      toast.error('Please fill in all fields and add at least one image');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        images: imageUrls,
      };

      if (productId) {
        await apiCall(`/admin/products/${productId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Product updated successfully');
      } else {
        await apiCall('/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Product created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card p-6 rounded-xl border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-semibold">Product Name *</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="w-full"
          />
        </motion.div>

        {/* Category */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-semibold">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>

        {/* Price */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-semibold">Price (₹) *</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            step="0.01"
            className="w-full"
          />
        </motion.div>

        {/* Stock */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-semibold">Stock Quantity *</label>
          <Input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            className="w-full"
          />
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="text-sm font-semibold">Description *</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed product description"
          rows={4}
          className="w-full"
        />
      </motion.div>

      {/* Image URLs */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="text-sm font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Product Images *
        </label>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image URL (e.g., https://...)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
            />
            <motion.button
              type="button"
              onClick={handleAddImage}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Add URL
            </motion.button>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleDeviceUpload}
              />
              <motion.label
                htmlFor="file-upload"
                className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-4 h-4" />
                Upload
              </motion.label>
            </div>
          </div>

          {/* Image Preview */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {imageUrls.map((url, index) => (
              <motion.div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <motion.button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-xs text-muted-foreground">
            Tip: Use free image URLs from Unsplash, Pexels, or Pixabay
          </p>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex gap-4 pt-6 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}

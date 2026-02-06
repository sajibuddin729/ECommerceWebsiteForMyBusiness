'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Store,
    CreditCard,
    Bell,
    Globe,
    Shield,
    Save,
    Palette,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Phone,
    MapPin,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
        },
        contactInfo: {
            email: '',
            phone: '',
            address: '',
        },
        appearance: {
            logo: '',
            favicon: '',
            primaryColor: '#6366f1',
            secondaryColor: '#a855f7',
            accentColor: '#f43f5e',
            heroTitle: 'Elevate Your Marketplace Experience',
            heroSubtitle: 'Discover premium apparel, footwear, cutting-edge electronics, and innovative digital solutions from top creators worldwide.',
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await apiCall('/settings');
            // Merge with default values for appearance just in case
            setSettings({
                ...data,
                appearance: {
                    logo: data.appearance?.logo || '',
                    favicon: data.appearance?.favicon || '',
                    primaryColor: data.appearance?.primaryColor || '#6366f1',
                    secondaryColor: data.appearance?.secondaryColor || '#a855f7',
                    accentColor: data.appearance?.accentColor || '#f43f5e',
                    heroTitle: data.appearance?.heroTitle || 'Elevate Your Marketplace Experience',
                    heroSubtitle: data.appearance?.heroSubtitle || 'Discover premium apparel, footwear, cutting-edge electronics, and innovative digital solutions from top creators worldwide.',
                }
            });
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiCall('/settings', {
                method: 'PUT',
                body: JSON.stringify(settings)
            });
            toast.success('Settings updated successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSettings(prev => ({
                ...prev,
                appearance: {
                    ...prev.appearance,
                    [type]: base64String
                }
            }));
            toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded from device`);
        };
        reader.readAsDataURL(file);
        // Reset input
        e.target.value = '';
    };

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Store Settings</h1>
                    <p className="text-muted-foreground">Configure your marketplace preferences and configurations.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-muted/50 rounded-xl mb-8">
                    <TabsTrigger value="general" className="rounded-lg py-2.5">
                        <Store className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="social" className="rounded-lg py-2.5">
                        <Facebook className="w-4 h-4 mr-2" />
                        Social
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg py-2.5">
                        <Palette className="w-4 h-4 mr-2" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-lg py-2.5">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payments
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid gap-6 md:grid-cols-2"
                    >
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" />
                                Contact Information
                            </h3>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">Contact Email</Label>
                                    <Input
                                        id="storeEmail"
                                        value={settings.contactInfo.email}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contactInfo: { ...settings.contactInfo, email: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storePhone">Phone Number</Label>
                                    <Input
                                        id="storePhone"
                                        value={settings.contactInfo.phone}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contactInfo: { ...settings.contactInfo, phone: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeAddress">Address</Label>
                                    <Input
                                        id="storeAddress"
                                        value={settings.contactInfo.address}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contactInfo: { ...settings.contactInfo, address: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Globe className="w-5 h-5 text-primary" />
                                Localization & SEO
                            </h3>
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Search Engine Indexing</Label>
                                        <p className="text-sm text-muted-foreground font-normal">Allow search engines to crawl your store.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground font-normal">Temporarily take the store offline.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="social">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl border border-border shadow-sm max-w-2xl"
                    >
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Social Media Links
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="facebook"
                                        className="pl-9"
                                        value={settings.socialLinks.facebook}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="instagram"
                                        className="pl-9"
                                        value={settings.socialLinks.instagram}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter URL</Label>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="twitter"
                                        className="pl-9"
                                        value={settings.socialLinks.twitter}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="linkedin"
                                        className="pl-9"
                                        value={settings.socialLinks.linkedin}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="appearance">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid gap-6 md:grid-cols-2"
                    >
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Palette className="w-5 h-5 text-primary" />
                                Branding Details
                            </h3>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="logo"
                                            placeholder="https://example.com/logo.png"
                                            value={settings.appearance.logo}
                                            className="flex-1"
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                appearance: { ...settings.appearance, logo: e.target.value }
                                            })}
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleUpload(e, 'logo')}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => document.getElementById('logo-upload')?.click()}
                                                className="h-10 px-3"
                                            >
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {settings.appearance.logo && (
                                        <div className="mt-2 p-2 bg-muted rounded-lg w-fit">
                                            <img src={settings.appearance.logo} alt="Logo Preview" className="h-8 w-auto object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="favicon">Favicon URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="favicon"
                                            placeholder="https://example.com/favicon.ico"
                                            value={settings.appearance.favicon}
                                            className="flex-1"
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                appearance: { ...settings.appearance, favicon: e.target.value }
                                            })}
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="favicon-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleUpload(e, 'favicon')}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => document.getElementById('favicon-upload')?.click()}
                                                className="h-10 px-3"
                                            >
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {settings.appearance.favicon && (
                                        <div className="mt-2 p-2 bg-muted rounded-lg w-fit">
                                            <img src={settings.appearance.favicon} alt="Favicon Preview" className="h-6 w-6 object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-4 h-32">
                                    <div className="space-y-2">
                                        <Label>Primary</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: settings.appearance.primaryColor }} />
                                            <Input
                                                type="color"
                                                className="p-0 border-none h-8 w-8 cursor-pointer"
                                                value={settings.appearance.primaryColor}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    appearance: { ...settings.appearance, primaryColor: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: settings.appearance.secondaryColor }} />
                                            <Input
                                                type="color"
                                                className="p-0 border-none h-8 w-8 cursor-pointer"
                                                value={settings.appearance.secondaryColor}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    appearance: { ...settings.appearance, secondaryColor: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Accent</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: settings.appearance.accentColor }} />
                                            <Input
                                                type="color"
                                                className="p-0 border-none h-8 w-8 cursor-pointer"
                                                value={settings.appearance.accentColor}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    appearance: { ...settings.appearance, accentColor: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Store className="w-5 h-5 text-primary" />
                                Hero Section Content
                            </h3>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="heroTitle">Hero Title</Label>
                                    <Input
                                        id="heroTitle"
                                        value={settings.appearance.heroTitle}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            appearance: { ...settings.appearance, heroTitle: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                                    <textarea
                                        id="heroSubtitle"
                                        className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={settings.appearance.heroSubtitle}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            appearance: { ...settings.appearance, heroSubtitle: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="payments">
                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-6">Payment Gateways</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border text-foreground">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded bg-indigo-500 flex items-center justify-center text-white font-bold">St</div>
                                    <div>
                                        <p className="font-semibold text-foreground">Stripe</p>
                                        <p className="text-sm text-muted-foreground">Credit cards and digital wallets</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}


'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

interface Appearance {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    heroTitle: string;
    heroSubtitle: string;
}

interface AppearanceContextType {
    appearance: Appearance | null;
    loading: boolean;
}

const AppearanceContext = createContext<AppearanceContextType>({
    appearance: null,
    loading: true,
});

export const useAppearance = () => useContext(AppearanceContext);

function hexToHsl(hex: string): string {
    // Remove the # if it exists
    hex = hex.replace(/^#/, '');

    // Parse r, g, b
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
    const [appearance, setAppearance] = useState<Appearance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppearance = async () => {
            try {
                const data = await apiCall('/settings');
                if (data && data.appearance) {
                    setAppearance(data.appearance);
                    applyAppearance(data.appearance);
                }
            } catch (error) {
                console.error('Failed to fetch appearance settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppearance();
    }, []);

    const applyAppearance = (app: Appearance) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;

        // Apply colors
        if (app.primaryColor) {
            root.style.setProperty('--primary', hexToHsl(app.primaryColor));
            root.style.setProperty('--ring', hexToHsl(app.primaryColor));
        }
        if (app.secondaryColor) {
            root.style.setProperty('--secondary', hexToHsl(app.secondaryColor));
        }
        if (app.accentColor) {
            root.style.setProperty('--accent', hexToHsl(app.accentColor));
        }

        // Apply favicon
        if (app.favicon) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = app.favicon;
        }
    };

    return (
        <AppearanceContext.Provider value={{ appearance, loading }}>
            {children}
        </AppearanceContext.Provider>
    );
};

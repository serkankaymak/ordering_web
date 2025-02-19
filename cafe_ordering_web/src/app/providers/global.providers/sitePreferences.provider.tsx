'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUserContext } from './user.povider';
import { SitePreferenceModel } from '@/app/api/preferences/SitePreferenceModel';
import { PreferencesClientService } from '@/application/services/sitepreference/PreferencesClientService';


interface PreferencesContextType {
    sitePreferences: SitePreferenceModel | null;
    refreshPreferences: () => Promise<void>;
    updatePreferences: (newPrefs: Partial<SitePreferenceModel>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const SitePreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [preferences, setPreferences] = useState<SitePreferenceModel | null>(null);
    const { user } = useUserContext(); // Global kullanıcı bilgisine erişim

    const refreshPreferences = async () => {
        try {
            const prefs = await PreferencesClientService.getPreferences();
            setPreferences(prefs);
        } catch (error) {
            console.error("Error fetching preferences", error);
        }
    };

    // updatePreferences artık parametre olarak user almıyor, doğrudan global user üzerinden çalışıyor.
    const updatePreferences = async (newPrefs: Partial<SitePreferenceModel>) => {
        try {
            if (!user) throw new Error("User not authenticated");
            const updated = await PreferencesClientService.updatePreferences(newPrefs);
            setPreferences(updated);
        } catch (error) {
            console.error("Error updating preferences", error);
        }
    };

    useEffect(() => {
        refreshPreferences();
    }, []);

    return (
        <PreferencesContext.Provider value={{ sitePreferences: preferences, refreshPreferences, updatePreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const useSitePreferencesContext = () => {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error("usePreferences must be used within a SitePreferencesProvider");
    }
    return context;
};

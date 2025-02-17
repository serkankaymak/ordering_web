"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeMode, themeService } from "@/application/services/theme/ThemeService";
import { darkTheme } from "@/application/services/theme/DarkTheme";
import { lightTheme } from "@/application/services/theme/LightTheme";
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode; }) => {
  // İlk değeri themeService üzerinden alıyoruz. Sunucuda sabit bir değer sağlanabilir.
  const [themeMode, setThemeMode] = useState<ThemeMode>(themeService.themeMode);
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    themeService.toggleTheme();
  };

  // Mevcut themeMode'a göre MUI teması oluşturuluyor.
  const theme = createTheme(themeMode === ThemeMode.DARK ? darkTheme : lightTheme);

  useEffect(() => {
    setMounted(true); // Client mount olduktan sonra mounted true olacak.
    const listener = (newThemeMode: ThemeMode) => {
      setThemeMode(newThemeMode);
    };
    themeService.addOnChangeListener(listener);
    return () => {
      // Eğer themeService üzerinde removeOnChangeListener varsa, temizleyin.
      // themeService.removeOnChangeListener(listener);
    };
  }, []);

  // Eğer component henüz mount olmadıysa hiçbir şey render etmeyin.
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useMyTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useMyTheme must be used within a ThemeProvider");
  }
  return context;
};

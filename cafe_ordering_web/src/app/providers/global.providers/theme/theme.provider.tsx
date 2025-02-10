// ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeMode, themeService } from "@/application/services/theme/ThemeService";
import { darkTheme } from "@/application/services/theme/DarkTheme";
import { lightTheme } from "@/application/services/theme/LightTheme";
import { Logcat } from "@/shared/LogCat";
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode; }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(themeService.themeMode);

  const toggleTheme = () => { themeService.toggleTheme(); };
  const theme = createTheme(themeMode === ThemeMode.DARK ? darkTheme : lightTheme);

  useEffect(() => {
    const listener = (newThemeMode: ThemeMode) => {
      Logcat.Debug(`Theme changed to: ${newThemeMode}`);
      setThemeMode(newThemeMode);
    };
    themeService.addOnChangeListener(listener);
    return () => { };
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        {/**CssBaseline bileşeni, tarayıcıların varsayılan stillerini sıfırlar ve temanızın stil ayarlarını uygular. */}
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
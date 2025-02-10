"use client";

import React, { ReactNode } from "react";
import { LocaleProvider } from "./global.providers/locale.provider";
import { ThemeProvider } from "./global.providers/theme/theme.provider"; // Your custom ThemeProvider

interface AppProviderProps {
  children: ReactNode;
}

export const AppGlobalProviders = ({ children }: AppProviderProps) => {
  return (
    <LocaleProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider> {/* Use your custom ThemeProvider */}
    </LocaleProvider>
  );
};


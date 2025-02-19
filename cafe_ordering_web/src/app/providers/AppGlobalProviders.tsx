
import React, { ReactNode } from "react";
import { LocaleProvider } from "./global.providers/locale.provider";
import { ThemeProvider } from "./global.providers/theme/theme.provider"; // Your custom ThemeProvider
import { UserProvider } from "./global.providers/user.povider";
import { SitePreferencesProvider } from "./global.providers/sitePreferences.provider";

interface AppProviderProps {
  children: ReactNode;
}

export const AppGlobalProviders = ({ children }: AppProviderProps) => {
  return (

    
    <UserProvider>
      <SitePreferencesProvider>

        <LocaleProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LocaleProvider>

      </SitePreferencesProvider>
    </UserProvider>

  );
};


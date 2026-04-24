"use client";

import { createContext, useContext } from "react";

export type AppTheme = "dark" | "light";

type AppThemeContextValue = {
  theme: AppTheme;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AppThemeContextValue;
}) {
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider.");
  }

  return context;
}

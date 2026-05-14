import { type PortfolioData } from "./types";

export const PORTFOLIO_STORAGE_KEY = "vampforge-portfolio-data";

export function readStoredPortfolioData() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PortfolioData) : null;
  } catch {
    return null;
  }
}

export function storePortfolioData(data: PortfolioData) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Large uploaded images can exceed localStorage. The ZIP export still works.
  }
}

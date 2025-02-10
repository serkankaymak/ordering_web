// ThemeService.ts
import { Logcat } from "@/shared/LogCat";

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
}

export class ThemeService {
  private _themeMode: ThemeMode;
  private listeners: ((themeMode: ThemeMode) => void)[] = [];

  constructor() {
    this._themeMode = typeof window !== "undefined" ? (this.getStoredThemeMode() || ThemeMode.LIGHT) : ThemeMode.LIGHT;
    Logcat.Debug(`ThemeService initialized with theme: ${this._themeMode}`);
  }

  private getStoredThemeMode(): ThemeMode | null {
    Logcat.Debug("getStoredThemeMode -->" + (typeof window === "undefined"))
    const storedMode = localStorage.getItem("themeMode");
    return storedMode === ThemeMode.DARK || storedMode === ThemeMode.LIGHT ? (storedMode as ThemeMode) : null;
  }

  private storeThemeMode(): void {
    localStorage.setItem("themeMode", this._themeMode);
  }

  get themeMode(): ThemeMode {
    return this._themeMode;
  }

  public toggleTheme(): void {
    this._themeMode = this._themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    this.storeThemeMode();
    this.notifyListeners();
  }

  public addOnChangeListener(listener: (themeMode: ThemeMode) => void): void {
    this.listeners.push(listener);
    listener(this._themeMode);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this._themeMode));
  }
}

export const themeService = new ThemeService();
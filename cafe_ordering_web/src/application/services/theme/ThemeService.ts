// ThemeService.ts
import { Logcat } from "@/shared/LogCat";

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
}

export class ThemeService {
  private _localStorage?: Storage;
  private _themeMode: ThemeMode;
  private listeners: ((themeMode: ThemeMode) => void)[] = [];

  constructor() {
    { try { this._localStorage = localStorage } catch (e: any) { } }
    this._themeMode = this.getStoredThemeMode() || ThemeMode.LIGHT;
    Logcat.Debug(`ThemeService initialized with theme: ${this._themeMode}`);
  }

  private getStoredThemeMode(): ThemeMode | null {
    if (this._localStorage == null) return null;
    const storedMode = this._localStorage.getItem("themeMode");
    return storedMode === ThemeMode.DARK || storedMode === ThemeMode.LIGHT ? (storedMode as ThemeMode) : null;
  }

  private storeThemeMode(): void {
    this._localStorage?.setItem("themeMode", this._themeMode);
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
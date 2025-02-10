import { Logcat } from "@/shared/LogCat";
import { LocalizationKeys } from "./LocalizationKeys";

export enum LanguageMode {
  EN = "en",
  TR = "tr",
}

export class LocalizationService {
  private async wait(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }

  private _languageMode: LanguageMode;
  private _listeners: Array<(languageMode: LanguageMode) => void> = [];
  private _translations: Record<string, string> = {};


  public get languageMode(): LanguageMode {
    return this._languageMode;
  }


  constructor() {
    if (typeof window !== "undefined") {
      const savedLanguage = this.getSavedLanguage();
      Logcat.Debug(`LocalizationService constructor executed: ${savedLanguage}`);
      this._languageMode = savedLanguage || LanguageMode.EN;
      this.loadTranslationsAsync().then(() => this.notifyListeners());
    } else {
      this._languageMode = LanguageMode.EN;
    }
  }

  public addOnChangeListener(listener: (languageMode: LanguageMode) => void): void {
    this._listeners.push(listener);
    listener(this._languageMode);
  }

  private notifyListeners(): void {
    this._listeners.forEach((listener) => listener(this._languageMode));
  }


  public async toggleLanguageAsync(): Promise<void> {
    const newLanguage = this._languageMode === LanguageMode.EN ? LanguageMode.TR : LanguageMode.EN;
    await this.setLanguageAsync(newLanguage);
  }

  public async setLanguageAsync(languageMode: LanguageMode): Promise<void> {
    if (this._languageMode !== languageMode) {
      this._languageMode = languageMode;
      this.saveLanguage(languageMode);
      await this.loadTranslationsAsync();
      this.notifyListeners();
    }
  }

  private getSavedLanguage(): LanguageMode | null {
    const savedLanguage = localStorage.getItem("languageMode");
    return savedLanguage === LanguageMode.EN || savedLanguage === LanguageMode.TR
      ? (savedLanguage as LanguageMode)
      : null;
  }

  private saveLanguage(language: LanguageMode): void { localStorage.setItem("languageMode", language); }

  private async loadTranslationsAsync(): Promise<void> {
    try {
      //await this.wait(3000);
      const response = await fetch(`/locales/${this._languageMode}.json`);
      this._translations = await response.json();
    } catch (error) {
      Logcat.Error(`Error loading translations for ${this._languageMode}: ${error}`);
      this._translations = {};
    }
  }

  public translate(key: LocalizationKeys): string {
    if (Object.keys(this._translations).length === 0) { return "loading..."; }
    return this._translations[LocalizationKeys[key]] || LocalizationKeys[key];
  }

}

export const localizationService = new LocalizationService();

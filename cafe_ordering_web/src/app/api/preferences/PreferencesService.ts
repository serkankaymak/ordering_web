import path from "path";
import { SitePreferenceModel } from "./SitePreferenceModel";
import fs from 'fs';

// PreferencesService: Dosya üzerinden tercihleri okur/yazar (iç yardımcı sınıf, export edilmiyor)
export class PreferencesService {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureDataDirectoryExists();
  }

  // data dizininin var olduğundan emin ol, yoksa oluştur
  private ensureDataDirectoryExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Dosyadan tercihleri okur.
  private readPreferences(): SitePreferenceModel {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return SitePreferenceModel.fromJson(JSON.parse(data));
      } else {
        // Dosya yoksa varsayılan değerleri döndür
        return new SitePreferenceModel();
      }
    } catch (error) {
      console.error('Tercihler okunurken hata oluştu:', error);
      var pref =  new SitePreferenceModel(); // Varsayılan değer
      pref.denemeCount= 999;
      return pref;
    }
  }

  // Tercihleri dosyaya yazar.
  private writePreferences(prefs: SitePreferenceModel): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(prefs, null, 2), 'utf-8');
    } catch (error) {
      console.error('Tercihler yazılırken hata oluştu:', error);
    }
  }

  public getPreferences(): SitePreferenceModel {
    return this.readPreferences();
  }

  public updatePreferences(newPrefs: Partial<SitePreferenceModel>): SitePreferenceModel {
    const current = this.readPreferences();
    const updated = new SitePreferenceModel({ ...current, ...newPrefs });
    this.writePreferences(updated);
    return updated;
  }
}

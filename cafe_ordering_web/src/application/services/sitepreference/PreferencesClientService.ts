
import { SitePreferenceModel } from '@/app/api/preferences/SitePreferenceModel';
import axios from 'axios';


// Client tarafında API route'una erişimi yöneten servis.
export class PreferencesClientService {
  private static apiUrl = '/api/preferences';

  // Mevcut site tercihlerini getirir (GET isteği)
  public static async getPreferences(): Promise<SitePreferenceModel> {
    const response = await axios.get<SitePreferenceModel>(this.apiUrl);
    //console.log("response data", response.data!);
    var preferenceObj = SitePreferenceModel.fromJson(response.data!);
    return preferenceObj;
  }

  // Site tercihlerini günceller (PUT isteği)
  public static async updatePreferences(newPrefs: Partial<SitePreferenceModel>): Promise<SitePreferenceModel> {
    const response = await axios.put<SitePreferenceModel>(this.apiUrl, newPrefs);
    var preferenceObj = SitePreferenceModel.fromJson(response.data!);
    return preferenceObj;
  }

  // Eğer isterseniz POST isteği de tanımlayabilirsiniz (PUT ile aynı işlevde)
  public static async createPreferences(newPrefs: Partial<SitePreferenceModel>): Promise<SitePreferenceModel> {
    const response = await axios.post<SitePreferenceModel>(this.apiUrl, newPrefs);
    var preferenceObj = SitePreferenceModel.fromJson(response.data!);
    return preferenceObj;
  }
}

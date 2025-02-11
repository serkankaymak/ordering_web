// ABaseHttpRequest.ts
import axios, { AxiosInstance } from "axios";

export abstract class ABaseHttpRequest<T> {
  protected client: AxiosInstance;
  protected url: string;

  constructor(url: string) {
    this.url = url;
    // Axios'un default client'ını veya özel yapılandırılmış bir instance oluşturabilirsiniz.
    this.client = axios.create();
  }

  /**
   * HTTP isteğini gerçekleştirir.
   * Alt sınıflarda uygulanması gereken abstract metod.
   */
  public abstract execute(): Promise<T>;

  /**
   * Başarılı durum kodları: 200 ile 299 arasındaysa true döndürür.
   * @param statusCode HTTP durum kodu
   */
  protected isSuccessStatusCode(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  /**
   * Yalnızca 201 (Created) durum kodunu kontrol eder.
   * @param statusCode HTTP durum kodu
   */
  protected isCreatedStatusCode(statusCode: number): boolean {
    return statusCode === 201;
  }

  /**
   * Yalnızca 204 (No Content / Updated) durum kodunu kontrol eder.
   * @param statusCode HTTP durum kodu
   */
  protected isUpdatedStatusCode(statusCode: number): boolean {
    return statusCode === 204;
  }
}

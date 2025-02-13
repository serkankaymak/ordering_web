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

  public abstract execute(): Promise<T>;

  protected isSuccessStatusCode(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }
}

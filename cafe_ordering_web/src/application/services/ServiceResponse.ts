// types/ServiceResponse.ts
export interface IServiceResponse<T> {
    isSuccess: boolean;
    data?: T;
    errorMessage?: string;
    cached?: boolean; // İsteğin cache'den gelip gelmediği bilgisi (opsiyonel)
    // Diğer metadata alanları eklenebilir...
  }
  
  export class ServiceResponse<T> implements IServiceResponse<T> {
    public isSuccess: boolean;
    public data?: T;
    public errorMessage?: string;
    public cached?: boolean;
  
    private constructor(success: boolean, data?: T, error?: string, cached?: boolean) {
      this.isSuccess = success;
      this.data = data;
      this.errorMessage = error;
      this.cached = cached;
    }
  
    // Başarılı sonuç için
    public static success<T>(data: T, cached: boolean = false): ServiceResponse<T> {
      return new ServiceResponse<T>(true, data, undefined, cached);
    }
  
    // Hata durumu için
    public static failure<T>(error: string): ServiceResponse<T> {
      return new ServiceResponse<T>(false, undefined, error);
    }
  }
  
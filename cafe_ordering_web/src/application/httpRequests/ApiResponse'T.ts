// types/ApiResponse.ts
export interface IApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    error?: string;
}

export class ApiResponse<T> implements IApiResponse<T> {
    public isSuccess: boolean;
    public data?: T;
    public error?: string;

    private constructor(success: boolean, data?: T, error?: string) {
        this.isSuccess = success;
        this.data = data;
        this.error = error;
    }

    public static success<T>(data: T): ApiResponse<T> { return new ApiResponse<T>(true, data); }

    public static failure<T>(error: string): ApiResponse<T> {
        return new ApiResponse<T>(false, undefined, error);
    }

    public static failureFromStatus<T>(status: number): ApiResponse<T> {
        const message = this.getErrorMessage(status);
        return new ApiResponse<T>(false, undefined, message);
      }

    private static getErrorMessage(status: number): string {
        let message = '';
        if (status >= 500) {
          message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else if (status === 404) {
          message = 'İstenilen kaynak bulunamadı.';
        } else if (status === 401) {
          message = 'Yetkisiz erişim. Giriş yapmanız gerekiyor.';
        } else if (status === 403) {
          message = 'Erişim engellendi.';
        } else if (status === 400) {
          message = 'Geçersiz istek.';
        } else {
          message = `Hata: ${status}`;
        }
        return message;
      }
}

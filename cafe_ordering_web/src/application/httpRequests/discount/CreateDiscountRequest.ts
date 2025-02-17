// requests/CreateDiscountRequest.ts
import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";


// İndirim öğesi komutunun arayüzü
export interface CreateDiscountItemCommand {
  requiredQuantity: number;
  productId: number;
}

// İndirim oluşturma komutunun arayüzü
export interface CreateDiscountCommand {
  discountName: string;
  discountPercentage?: number | null;
  maxApplicableTimes?: number; // Varsayılan değer 1
  discountType: number; // Enum değeri (örneğin: 0,1,2 gibi)
  endDateAsUtc: string; 
  // ISO formatında tarih (örneğin: "2025-12-31T23:59:59Z")
  categoryId?: number | null;
  discountItems?: CreateDiscountItemCommand[];
}

/**
 * CreateDiscountRequest, backend'de indirim oluşturma isteğini
 * API'ye göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * İşlem sonucu ApiResponse<void> olarak döndürülür.
 */
export class CreateDiscountRequest extends ABaseHttpRequest<ApiResponse<void>> {
  private command: CreateDiscountCommand;

  constructor(url: string, command: CreateDiscountCommand) {
    super(url);
    this.command = command;
  }

  public async execute(): Promise<ApiResponse<void>> {
    try {
      // Backend'in model binding'ine uygun olacak şekilde PascalCase alan isimleriyle payload oluşturuluyor.
      const payload = this.command;

      // JSON formatında POST isteği gönderiliyor.
      const response = await this.client.post(this.url, payload, {
        validateStatus: (status: number) => status < 500, // 500'den küçük tüm durumlar başarılı kabul edilir
      });

      if (this.isSuccessStatusCode(response.status)) {
        return ApiResponse.success<void>(undefined);
      }

      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<void>(response.status);
    } catch (error: any) {
      console.error("Error creating discount:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<void>(error.response.status);
      }
      return ApiResponse.failure<void>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; CreateDiscountRequest instance'ını oluşturur ve isteği yürütür.
   *
   * @param command İndirim oluşturma komutu
   * @returns ApiResponse<void> sonucu
   */
  public static async send(command: CreateDiscountCommand): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetCreateDiscountUrl(); // İlgili endpoint URL'si
    const request = new CreateDiscountRequest(url, command);
    return await request.execute();
  }
}

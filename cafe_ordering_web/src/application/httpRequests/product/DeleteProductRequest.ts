import axios from "axios";
import ApiUrls from "../HostUrl";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ApiResponse } from "../ApiResponse'T";


export class DeleteProductRequest extends ABaseHttpRequest<ApiResponse<void>> {
  constructor(url: string) {
    super(url);
  }

  /**
   * Ürün silme işlemini gerçekleştiren metot.
   * DELETE isteği gönderilir, başarılı ise ApiResponse.success(undefined) döner;
   * hata durumunda ilgili hata mesajı içeren ApiResponse.failure döndürülür.
   */
  public async execute(): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.delete<void>(this.url, {
        headers: { Accept: "*/*" },
        validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodları başarılı kabul edilir
      });

      if (!this.isSuccessStatusCode(response.status)) {
        // HTTP durum koduna göre otomatik hata mesajı üreten response döndürülür.
        return ApiResponse.failureFromStatus<void>(response.status);
      }
      return ApiResponse.success<void>(undefined);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<void>(error.response.status);
      }
      return ApiResponse.failure<void>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Static metod, ürün ID'sine göre silme isteğini tetikler.
   * Örneğin: DeleteProductRequest.send(3) çağrısı,
   * "https://localhost:7106/api/Product/deleteproduct/3" adresine DELETE isteği gönderir.
   */
  public static async send(productId: number): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetDeleteProductUrl(); // Örneğin, "https://localhost:7106/api/Product/deleteproduct"
    const _url = `${url}/${productId}`;
    const request = new DeleteProductRequest(_url);
    return await request.execute();
  }
}

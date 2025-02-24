import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ProductModel } from "@/domain/ProductModels";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";
import { OrderModel } from "@/domain/OrderModels";



export class GetOrderByOrderIdRequest extends ABaseHttpRequest<ApiResponse<OrderModel>> {
  // Constructor artık sadece final URL'i alır.
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve tek bir ürünü (OrderModel) döndürür.
   * Başarılı durumda ApiResponse.success(product) döner;
   * hata durumunda HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döndürür.
   */
  public async execute(): Promise<ApiResponse<OrderModel>> {
    try {
      const response = await this.client.get<OrderModel>(this.url, {
        headers: { Accept: "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        let order = OrderModel.fromJson(response.data);
        return ApiResponse.success<OrderModel>(order);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<OrderModel>(response.status);
    } catch (error: any) {
      console.error("GetProductWithCategoriesById Hatası:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<OrderModel>(error.response.status);
      }
      return ApiResponse.failure<OrderModel>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; GetProductWithCategoriesById instance'ını oluşturur ve isteği yürütür.
   * Örneğin: GetProductWithCategoriesByIdRequest.send(3) çağrısı,
   * "https://localhost:7106/api/Product/3" adresine GET isteği gönderir.
   */
  public static async send(id: number): Promise<ApiResponse<OrderModel>> {
    const url: string = `${ApiUrls.GetOrderUrl()}/${id}`;
    const request = new GetOrderByOrderIdRequest(url);
    return await request.execute();
  }
}

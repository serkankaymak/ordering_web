import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ProductModel } from "@/domain/ProductModels";
import { ApiResponse } from "../ApiResponse'T";
import { OrderModel } from "@/domain/OrderModels";


export class GetUnCompletedOrderRequest extends ABaseHttpRequest<ApiResponse<OrderModel[]>> {
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve ürün listesini döndürür.
   * Başarılı durumda ApiResponse.success(products) döner;
   * hata durumunda ise ApiResponse.failureFromStatus ya da ApiResponse.failure ile hata mesajı döndürülür.
   */
  public async execute(): Promise<ApiResponse<OrderModel[]>> {
    try {
      const response = await this.client.get<OrderModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodlarını başarılı sayar
      });

      if (this.isSuccessStatusCode(response.status)) {
        const dtos = response.data.map((json: any) => {
          const order = OrderModel.fromJson(json);
         return order;
        });
        return ApiResponse.success(dtos);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<OrderModel[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<OrderModel[]>(error.response.status);
      }
      return ApiResponse.failure<OrderModel[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; GetProductsRequest instance'ını oluşturur ve isteği yürütür.
   * @returns Ürün listesini içeren ApiResponse<OrderModel[]> döner.
   */
  public static async send(): Promise<ApiResponse<OrderModel[]>> {
    const url = ApiUrls.GetUnCompletedOrdersUrl(); // Ürünleri getiren endpoint URL'si
    const request = new GetUnCompletedOrderRequest(url);
    return await request.execute();
  }
}

import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ProductModel } from "@/domain/ProductModels";
import { ApiResponse } from "../ApiResponse'T";
import { DiscountModel } from "@/domain/DiscountModels";




export class GetDiscountsRequest extends ABaseHttpRequest<ApiResponse<DiscountModel[]>> {
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve menü listesini (ProductModel[]) döndürür.
   * Başarılı durumda ApiResponse.success(products) döner;
   * hata durumunda ise HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döner.
   */
  public async execute(): Promise<ApiResponse<DiscountModel[]>> {
    try {
      const response = await this.client.get<DiscountModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        const products = response.data.map((productJson: any) => {
          let product = DiscountModel.fromJson(productJson);
          return product;
        });
        return ApiResponse.success<DiscountModel[]>(products);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<DiscountModel[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<DiscountModel[]>(error.response.status);
      }
      return ApiResponse.failure<DiscountModel[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; GetMenusRequest instance'ını oluşturur ve isteği yürütür.
   * @returns Ürün listesi içeren ApiResponse<ProductModel[]>.
   */
  public static async send(): Promise<ApiResponse<DiscountModel[]>> {
    const url: string = ApiUrls.GetDiscountsUrl(); // Ürünleri getiren endpoint URL'si
    const request = new GetDiscountsRequest(url);
    return await request.execute();
  }
}

import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ProductModel } from "@/domain/ProductModels";
import { ApiResponse } from "../ApiResponse'T";


export class GetProductsRequest extends ABaseHttpRequest<ApiResponse<ProductModel[]>> {
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve ürün listesini döndürür.
   * Başarılı durumda ApiResponse.success(products) döner;
   * hata durumunda ise ApiResponse.failureFromStatus ya da ApiResponse.failure ile hata mesajı döndürülür.
   */
  public async execute(): Promise<ApiResponse<ProductModel[]>> {
    try {
      const response = await this.client.get<ProductModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodlarını başarılı sayar
      });

      if (this.isSuccessStatusCode(response.status)) {
        const products = response.data.map((productJson: any) => {
          const product = ProductModel.fromJson(productJson);
          if (product.imagePath) {
            // Eğer gerekiyorsa, imagePath'in başındaki eğik çizgileri temizleyip base URL ile birleştirebilirsiniz.
            // Örneğin:
            // product.imagePath = `${ApiUrls.Host()}/${product.imagePath.replace(/^\/+/, "")}`;
          }
          return product;
        });
        return ApiResponse.success(products);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<ProductModel[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<ProductModel[]>(error.response.status);
      }
      return ApiResponse.failure<ProductModel[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; GetProductsRequest instance'ını oluşturur ve isteği yürütür.
   * @returns Ürün listesini içeren ApiResponse<ProductModel[]> döner.
   */
  public static async send(): Promise<ApiResponse<ProductModel[]>> {
    const url = ApiUrls.GetProductsUrl(); // Ürünleri getiren endpoint URL'si
    const request = new GetProductsRequest(url);
    return await request.execute();
  }
}

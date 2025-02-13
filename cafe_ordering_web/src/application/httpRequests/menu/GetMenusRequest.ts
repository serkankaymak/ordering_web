import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ProductModel } from "@/domain/ProductModels";
import { ApiResponse } from "../ApiResponse'T";


const setParentChildLinks = (product: ProductModel): ProductModel => {
  for (let index = 0; index < product.products!.length; index++) {
    const child = product.products![index];
    child.parent = product;
    child.parentBoxId = product.id;
    if (child.products != null) {
      setParentChildLinks(child);
    }
  }
  return product;
};

export class GetMenusRequest extends ABaseHttpRequest<ApiResponse<ProductModel[]>> {
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve menü listesini (ProductModel[]) döndürür.
   * Başarılı durumda ApiResponse.success(products) döner;
   * hata durumunda ise HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döner.
   */
  public async execute(): Promise<ApiResponse<ProductModel[]>> {
    try {
      const response = await this.client.get<ProductModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        const products = response.data.map((productJson: any) => {
          let product = ProductModel.fromJson(productJson);
          product = setParentChildLinks(product);
          return product;
        });
        return ApiResponse.success<ProductModel[]>(products);
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
   * Statik metod; GetMenusRequest instance'ını oluşturur ve isteği yürütür.
   * @returns Ürün listesi içeren ApiResponse<ProductModel[]>.
   */
  public static async send(): Promise<ApiResponse<ProductModel[]>> {
    const url: string = ApiUrls.GetMenusUrl(); // Ürünleri getiren endpoint URL'si
    const request = new GetMenusRequest(url);
    return await request.execute();
  }
}

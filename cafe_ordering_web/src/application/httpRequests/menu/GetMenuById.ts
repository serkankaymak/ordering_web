import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ProductModel } from "@/domain/ProductModels";
import ApiUrls from "../HostUrl";
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

export class GetMenuWithCategoriesByIdRequest extends ABaseHttpRequest<ApiResponse<ProductModel>> {
  // Constructor artık sadece final URL'i alır.
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve tek bir ürünü (ProductModel) döndürür.
   * Başarılı durumda ApiResponse.success(product) döner;
   * hata durumunda HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döndürür.
   */
  public async execute(): Promise<ApiResponse<ProductModel>> {
    try {
      const response = await this.client.get<ProductModel>(this.url, {
        headers: { Accept: "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        let product = ProductModel.fromJson(response.data);
        product = setParentChildLinks(product);
        return ApiResponse.success<ProductModel>(product);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<ProductModel>(response.status);
    } catch (error: any) {
      console.error("GetProductWithCategoriesById Hatası:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<ProductModel>(error.response.status);
      }
      return ApiResponse.failure<ProductModel>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; GetProductWithCategoriesById instance'ını oluşturur ve isteği yürütür.
   * Örneğin: GetProductWithCategoriesByIdRequest.send(3) çağrısı,
   * "https://localhost:7106/api/Product/3" adresine GET isteği gönderir.
   */
  public static async send(id: number): Promise<ApiResponse<ProductModel>> {
    const url: string = `${ApiUrls.GetMenuUrl()}/${id}`;
    const request = new GetMenuWithCategoriesByIdRequest(url);
    return await request.execute();
  }
}

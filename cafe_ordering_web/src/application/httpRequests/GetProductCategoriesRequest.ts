import axios from "axios";
import { CategoryModel } from "@/domain/ProductModels";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "./HostUrl";
import { ApiResponse } from "./ApiResponse'T";


export class GetCategoriesRequest extends ABaseHttpRequest<ApiResponse<CategoryModel[]>> {
  constructor(url: string) {
    super(url);
  }

  public async execute(): Promise<ApiResponse<CategoryModel[]>> {
    try {
      const response = await this.client.get<CategoryModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        // 500'den küçük tüm durum kodlarını başarılı sayıyoruz
        validateStatus: (status) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        // İsteğin başarılı olduğu durumda, veriyi ApiResponse.success ile sarmalıyoruz.
        const categories = response.data.map((category) => category);
        return ApiResponse.success<CategoryModel[]>(categories);
      }
      console.error(`Request failed with status: ${response.status}`);
      // HTTP durum koduna göre otomatik hata mesajı üretiyoruz.
      return ApiResponse.failureFromStatus<CategoryModel[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      // Axios hatası ve hata yanıtı varsa, HTTP durum koduna göre hata mesajı üretelim.
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<CategoryModel[]>(error.response.status);
      }
      // Bilinmeyen hata durumunda genel hata mesajı ile failure response döndürüyoruz.
      return ApiResponse.failure<CategoryModel[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  public static async send(): Promise<ApiResponse<CategoryModel[]>> {
    const url: string = ApiUrls.GetCategoriesUrl(); // Endpoint URL'sini alıyoruz.
    const request = new GetCategoriesRequest(url);
    return await request.execute();
  }
}

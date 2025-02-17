import axios from "axios";
import ApiUrls from "./HostUrl";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ApiResponse } from "./ApiResponse'T";


// API çağrısını yapıp, sonuç olarak ApiResponse<string[]> döndüren yardımcı fonksiyon
const fetchProductImages = async (url: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await axios.get<string[]>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Başarılı ise veriyi ApiResponse.success ile sarmalayıp döndürüyoruz.
    return ApiResponse.success(response.data);
  } catch (error: any) {
    console.log("Ürün görselleri alınırken hata oluştu:", error);
    // Axios hatası ise durum kodunu kontrol ediyoruz
    if (axios.isAxiosError(error) && error.response) {
      return ApiResponse.failureFromStatus<string[]>(error.response.status);
    }
    // Bilinmeyen hata durumunda genel bir hata mesajı
    return ApiResponse.failure<string[]>("Bilinmeyen bir hata oluştu.");
  }
};

export class GetAvaibleProductImagesRequest extends ABaseHttpRequest<ApiResponse<string[]>> {
  // execute metodu artık ApiResponse<string[]> dönecek şekilde düzenlendi
  public execute(): Promise<ApiResponse<string[]>> {
    return fetchProductImages(ApiUrls.GetProductImagesUrl());
  }

  constructor(url: string) {
    super(url);
  }

  // sendAsync metodu, doğru URL (GetProductImagesUrl) kullanılarak ApiResponse<string[]> döndürür.
  public static async send(): Promise<ApiResponse<string[]>> {
    const url: string = ApiUrls.GetProductImagesUrl(); 
    const request = new GetAvaibleProductImagesRequest(url);
    return await request.execute();
  }
}

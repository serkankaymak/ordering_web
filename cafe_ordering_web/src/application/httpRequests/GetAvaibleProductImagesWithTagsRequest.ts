import axios from "axios";
import ApiUrls from "./HostUrl";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ApiResponse } from "./ApiResponse'T";
import { ProductImageDto } from "../dtos/ProductImageDto";


// API çağrısını yapıp, sonuç olarak ApiResponse<string[]> döndüren yardımcı fonksiyon
const GetAvaibleProductImagesWithTags = async (url: string): Promise<ApiResponse<ProductImageDto[]>> => {
  try {
    const response = await axios.get<ProductImageDto[]>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    //console.log(response.data);
    // Başarılı ise veriyi ApiResponse.success ile sarmalayıp döndürüyoruz.
    const _data = response.data.map((json: any) => ProductImageDto.fromJson(json));
    console.log("_data ---->",_data);
    return ApiResponse.success(_data);

  } catch (error: any) {
    console.log("Ürün görselleri alınırken hata oluştu:", error);
    // Axios hatası ise durum kodunu kontrol ediyoruz
    if (axios.isAxiosError(error) && error.response) {
      return ApiResponse.failureFromStatus<ProductImageDto[]>(error.response.status);
    }
    // Bilinmeyen hata durumunda genel bir hata mesajı
    return ApiResponse.failure<ProductImageDto[]>("Bilinmeyen bir hata oluştu.");
  }
};

export class GetAvaibleProductImagesWithTagsRequest extends ABaseHttpRequest<ApiResponse<ProductImageDto[]>> {
  // execute metodu artık ApiResponse<string[]> dönecek şekilde düzenlendi
  public execute(): Promise<ApiResponse<ProductImageDto[]>> {
    return GetAvaibleProductImagesWithTags(ApiUrls.GetProductImagesWithTagsUrl());
  }

  constructor(url: string) {
    super(url);
  }

  // sendAsync metodu, doğru URL (GetProductImagesUrl) kullanılarak ApiResponse<string[]> döndürür.
  public static async send(): Promise<ApiResponse<ProductImageDto[]>> {
    const url: string = ApiUrls.GetProductImagesWithTagsUrl();
    const request = new GetAvaibleProductImagesWithTagsRequest(url);
    return await request.execute();
  }
}

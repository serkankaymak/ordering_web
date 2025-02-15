import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ProductModel } from "@/domain/ProductModels";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";
import { DiscountModel } from "@/domain/DiscountModels";


export class GetDiscountByIdRequest extends ABaseHttpRequest<ApiResponse<DiscountModel>> {
  constructor(url: string) {
    super(url);
  }

  public async execute(): Promise<ApiResponse<DiscountModel>> {
    try {
      const response = await this.client.get<DiscountModel>(this.url, {
        headers: { Accept: "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        let product = DiscountModel.fromJson(response.data);
        return ApiResponse.success<DiscountModel>(product);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<DiscountModel>(response.status);
    } catch (error: any) {
      console.error("GetDiscountByIdRequest Hatası:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<DiscountModel>(error.response.status);
      }
      return ApiResponse.failure<DiscountModel>("Bilinmeyen bir hata oluştu.");
    }
  }


  public static async send(id: number): Promise<ApiResponse<DiscountModel>> {
    const url: string = `${ApiUrls.GetDiscountUrl()}/${id}`;
    console.log(url);
    const request = new GetDiscountByIdRequest(url);
    return await request.execute();
  }
}

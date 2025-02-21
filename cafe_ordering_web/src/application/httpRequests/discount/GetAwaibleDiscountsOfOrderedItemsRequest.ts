import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { DiscountModel } from "@/domain/DiscountModels";
import { ApiResponse } from "../ApiResponse'T";


export interface GetAwaibleDiscountsOfOrderedItemsRequestPayload {
  userId?: number;
  orderItems: {
    quantity: number;
    productId: number;
  }[];
}

export class GetAwaibleDiscountsRequest extends ABaseHttpRequest<ApiResponse<DiscountModel[]>> {
  private requestPayload: GetAwaibleDiscountsOfOrderedItemsRequestPayload;

  constructor(url: string, requestPayload: GetAwaibleDiscountsOfOrderedItemsRequestPayload) {
    super(url);
    this.requestPayload = requestPayload;
  }

  public async execute(): Promise<ApiResponse<DiscountModel[]>> {
    try {
      const response = await this.client.post<DiscountModel[]>(this.url, this.requestPayload, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        const discounts = response.data.map((discountJson: any) => {
          return DiscountModel.fromJson(discountJson);
        });
        return ApiResponse.success<DiscountModel[]>(discounts);
      }

      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<DiscountModel[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching available discounts:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<DiscountModel[]>(error.response.status);
      }
      return ApiResponse.failure<DiscountModel[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  public static async send(
    requestPayload: GetAwaibleDiscountsOfOrderedItemsRequestPayload
  ): Promise<ApiResponse<DiscountModel[]>> {
    const url: string = ApiUrls.GetAwaibleDiscountsOfOrderedItemsUrl(); // İlgili endpoint URL'si
    const request = new GetAwaibleDiscountsRequest(url, requestPayload);
    var response =  await request.execute();
    return response
  }
}
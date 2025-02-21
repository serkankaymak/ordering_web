import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";
import { OrderCanHaveDiscountDto } from "@/application/dtos/OrderCanHaveDiscountDto";


export interface GetOrderItemsHasDiscountsRequestPayload {
  userId?: number;
  orderItems: {
    quantity: number;
    productId: number;
  }[];
}

export class GetOrderItemsHasDiscountsRequest extends ABaseHttpRequest<ApiResponse<OrderCanHaveDiscountDto[]>> {
  private requestPayload: GetOrderItemsHasDiscountsRequestPayload;

  constructor(url: string, requestPayload: GetOrderItemsHasDiscountsRequestPayload) {
    super(url);
    this.requestPayload = requestPayload;
  }

  public async execute(): Promise<ApiResponse<OrderCanHaveDiscountDto[]>> {
    try {
      const response = await this.client.post<OrderCanHaveDiscountDto[]>(this.url, this.requestPayload, {
        headers: { "Accept": "application/json" },
        validateStatus: (status: number) => status < 500,
      });

      if (this.isSuccessStatusCode(response.status)) {
        const discounts = response.data.map((discountJson: any) => {
          console.log(discountJson);
          return OrderCanHaveDiscountDto.fromJson(discountJson);
        });
        return ApiResponse.success<OrderCanHaveDiscountDto[]>(discounts);
      }

      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<OrderCanHaveDiscountDto[]>(response.status);
    } catch (error: any) {
      console.error("Error fetching available discounts:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<OrderCanHaveDiscountDto[]>(error.response.status);
      }
      return ApiResponse.failure<OrderCanHaveDiscountDto[]>("Bilinmeyen bir hata oluştu.");
    }
  }

  public static async send(
    requestPayload: GetOrderItemsHasDiscountsRequestPayload
  ): Promise<ApiResponse<OrderCanHaveDiscountDto[]>> {
    const url: string = ApiUrls.GetOrderItemsCanHaveDiscountsUrl(); // İlgili endpoint URL'si
    const request = new GetOrderItemsHasDiscountsRequest(url, requestPayload);
    var response = await request.execute();
    return response
  }
}
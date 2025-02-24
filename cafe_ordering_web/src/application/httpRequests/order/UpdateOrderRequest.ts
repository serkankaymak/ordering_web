import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";


// UpdateOrderCommand, C#'daki yapıyla uyumlu olacak şekilde
export interface UpdateOrderCommand {
  orderId: number;
  userId?: number;
  tableId: number;
  isReady?: boolean;
  isPayed?: boolean;
  isDelivered?: boolean;
  orderMenuItems: {
    productId: number;
    quantity: number;
  }[];
}

export class UpdateOrderRequest extends ABaseHttpRequest<ApiResponse<void>> {
  private command: UpdateOrderCommand;

  constructor(url: string, command: UpdateOrderCommand) {
    super(url);
    this.command = command;
  }

  // execute metodu HTTP PUT isteği yapacak şekilde implement edilmiştir.
  public async execute(): Promise<ApiResponse<void>> {
    const response = await fetch(this.url, {
      method: 'PUT', // Güncelleme işlemi için PUT kullanıyoruz.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.command),
    });

    if (this.isSuccessStatusCode(response.status)) {
      return ApiResponse.success<void>(undefined);
    } else {
      return ApiResponse.failure<void>("Failed to update order");
    }
  }

  // Statik send metodu, URL'i ApiUrls üzerinden alıp isteği gönderir.
  public static async send(command: UpdateOrderCommand): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetUpdateOrderUrl();
    const request = new UpdateOrderRequest(url, command);
    return await request.execute();
  }
}
